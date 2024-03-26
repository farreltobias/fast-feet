import {
  DeliveriesRepository,
  DeliverymanParams,
  LocationParams,
} from '@/domain/warehouse/application/repositories/deliveries-repository'
import { Delivery } from '@/domain/warehouse/enterprise/entities/delivery'
import { InMemoryDeliveryConfirmationPhotosRepository } from './in-memory-delivery-confirmation-photos-repository'
import { DeliveryWithLocation } from '@/domain/warehouse/enterprise/entities/value-objects/delivery-with-location'
import { InMemoryRecipientsRepository } from './in-memory-recipients-repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryDeliveriesRepository implements DeliveriesRepository {
  public items: Delivery[] = []

  constructor(
    private deliveryConfirmationPhotosRepository: InMemoryDeliveryConfirmationPhotosRepository,
    private recipientsRepository: InMemoryRecipientsRepository,
  ) {}

  async findManyByDeliveryman(
    params: DeliverymanParams,
  ): Promise<DeliveryWithLocation[]> {
    const deliveriesByDeliveryman = this.items.filter((delivery) => {
      return (
        delivery.withdrawnBy?.toString() === params.deliverymanId &&
        (!params.status || delivery.status.value === params.status)
      )
    })

    const deliveriesWithLocation = deliveriesByDeliveryman
      .reduce((acc: DeliveryWithLocation[], delivery) => {
        const { recipientId } = delivery

        if (!recipientId) {
          return acc
        }

        const recipient = this.recipientsRepository.items.find((recipient) =>
          recipient.id.equals(recipientId),
        )

        if (!recipient) {
          return acc
        }

        const deliveryWithLocation = DeliveryWithLocation.create({
          name: delivery.name,
          slug: delivery.slug,
          status: delivery.status,
          city: recipient.city,
          neighborhood: recipient.neighborhood,
          state: recipient.state,
          updatedAt: delivery.updatedAt,
        })

        return [deliveryWithLocation, ...acc]
      }, [])
      .slice((params.page - 1) * 20, params.page * 20)

    return deliveriesWithLocation
  }

  async findManyByLocation({
    city,
    state,
    neighborhood,
    status,
    page,
  }: LocationParams): Promise<DeliveryWithLocation[]> {
    const recipients = this.recipientsRepository.items.filter((recipient) => {
      return (
        recipient.city === city &&
        recipient.state === state &&
        (!neighborhood || recipient.neighborhood === neighborhood)
      )
    })

    const deliveriesWithLocation = this.items
      .filter((delivery) => {
        return !status || delivery.status.value === status
      })
      .reduce((acc: DeliveryWithLocation[], delivery) => {
        const { recipientId } = delivery

        if (!recipientId) {
          return acc
        }

        const recipient = recipients.find((recipient) =>
          recipient.id.equals(recipientId),
        )

        if (!recipient) {
          return acc
        }

        const deliveryWithLocation = DeliveryWithLocation.create({
          name: delivery.name,
          slug: delivery.slug,
          status: delivery.status,
          city: recipient.city,
          neighborhood: recipient.neighborhood,
          state: recipient.state,
          updatedAt: delivery.updatedAt,
        })

        return [deliveryWithLocation, ...acc]
      }, [])

    const pagedDeliveries = deliveriesWithLocation.slice(
      (page - 1) * 20,
      page * 20,
    )

    return pagedDeliveries
  }

  async findById(id: string): Promise<Delivery | null> {
    const delivery = this.items.find((item) => item.id.toString() === id)

    if (!delivery) {
      return null
    }

    return delivery
  }

  async save(delivery: Delivery): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(delivery.id))

    this.items[index] = delivery

    if (delivery.confirmationPhoto) {
      await this.deliveryConfirmationPhotosRepository.create(
        delivery.confirmationPhoto,
      )
    }

    DomainEvents.dispatchEventsForAggregate(delivery.id)
  }

  async create(delivery: Delivery) {
    this.items.push(delivery)
  }
}
