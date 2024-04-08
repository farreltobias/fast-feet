import {
  DeliveriesRepository,
  DeliverymanParams,
  LocationParams,
} from '@/domain/warehouse/application/repositories/deliveries-repository'
import { Delivery } from '@/domain/warehouse/enterprise/entities/delivery'
import { InMemoryDeliveryConfirmationPhotosRepository } from './in-memory-delivery-confirmation-photos-repository'
import { DeliveryDetails } from '@/domain/warehouse/enterprise/entities/value-objects/delivery-details'
import { InMemoryRecipientsRepository } from './in-memory-recipients-repository'
import { DomainEvents } from '@/core/events/domain-events'
import { DeliveryWithRecipient } from '@/domain/warehouse/enterprise/entities/value-objects/delivery-with-recipient'

export class InMemoryDeliveriesRepository implements DeliveriesRepository {
  public items: Delivery[] = []

  constructor(
    private deliveryConfirmationPhotosRepository: InMemoryDeliveryConfirmationPhotosRepository,
    private recipientsRepository: InMemoryRecipientsRepository,
  ) {}

  async findManyByDeliveryman(
    params: DeliverymanParams,
  ): Promise<DeliveryDetails[]> {
    const deliveriesByDeliveryman = this.items.filter((delivery) => {
      return (
        delivery.withdrawnBy?.toString() === params.deliverymanId &&
        (!params.status || delivery.status.value === params.status)
      )
    })

    const deliveriesDetails = deliveriesByDeliveryman
      .reduce((acc: DeliveryDetails[], delivery) => {
        const { postedTo } = delivery

        if (!postedTo) {
          return acc
        }

        const recipient = this.recipientsRepository.items.find((recipient) =>
          recipient.id.equals(postedTo),
        )

        if (!recipient) {
          return acc
        }

        const deliveryDetails = DeliveryDetails.create({
          name: delivery.name,
          slug: delivery.slug,
          status: delivery.status,
          city: recipient.city,
          neighborhood: recipient.neighborhood,
          state: recipient.state,
          updatedAt: delivery.updatedAt,
        })

        return [deliveryDetails, ...acc]
      }, [])
      .slice((params.page - 1) * 20, params.page * 20)

    return deliveriesDetails
  }

  async findManyByLocation({
    city,
    state,
    neighborhood,
    status,
    page,
  }: LocationParams): Promise<DeliveryDetails[]> {
    const recipients = this.recipientsRepository.items.filter((recipient) => {
      return (
        recipient.city === city &&
        recipient.state === state &&
        (!neighborhood || recipient.neighborhood === neighborhood)
      )
    })

    const deliveriesDetails = this.items
      .filter((delivery) => {
        return !status || delivery.status.value === status
      })
      .reduce((acc: DeliveryDetails[], delivery) => {
        const { postedTo } = delivery

        if (!postedTo) {
          return acc
        }

        const recipient = recipients.find((recipient) =>
          recipient.id.equals(postedTo),
        )

        if (!recipient) {
          return acc
        }

        const deliveryDetails = DeliveryDetails.create({
          name: delivery.name,
          slug: delivery.slug,
          status: delivery.status,
          city: recipient.city,
          neighborhood: recipient.neighborhood,
          state: recipient.state,
          updatedAt: delivery.updatedAt,
        })

        return [deliveryDetails, ...acc]
      }, [])

    const pagedDeliveries = deliveriesDetails.slice((page - 1) * 20, page * 20)

    return pagedDeliveries
  }

  async findById(id: string): Promise<Delivery | null> {
    const delivery = this.items.find((item) => item.id.toString() === id)

    if (!delivery) {
      return null
    }

    return delivery
  }

  async findBySlug(slug: string): Promise<DeliveryWithRecipient | null> {
    const delivery = this.items.find((item) => item.slug.value === slug)

    const recipient = await this.recipientsRepository.findById(
      delivery?.postedTo?.toString() || '',
    )

    if (!delivery || !recipient) {
      return null
    }

    return DeliveryWithRecipient.create({
      recipientName: recipient.name,
      street: recipient.street,
      number: recipient.number,
      complement: recipient.complement,
      city: recipient.city,
      neighborhood: recipient.neighborhood,
      zipCode: recipient.zipCode,
      state: recipient.state,
      status: delivery.status,
      postedAt: delivery.postedAt,
      withdrawnAt: delivery.withdrawnAt,
      deliveredAt: delivery.deliveredAt,
    })
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
