import {
  DeliveriesRepository,
  DeliverymanParams,
  LocationParams,
} from '@/domain/warehouse/application/repositories/deliveries-repository'
import { Delivery } from '@/domain/warehouse/enterprise/entities/delivery'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaDeliveryMapper } from '../mappers/prisma-delivery-mapper'
import { DeliveryDetails } from '@/domain/warehouse/enterprise/entities/value-objects/delivery-details'
import { DomainEvents } from '@/core/events/domain-events'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { DeliveryConfirmationPhotosRepository } from '@/domain/warehouse/application/repositories/delivery-confirmation-photos-repository'
import { DeliveryStatus } from '@prisma/client'
import { PrismaDeliveryDetailsMapper } from '../mappers/prisma-delivery-details-mapper'
import { DeliveryWithRecipient } from '@/domain/warehouse/enterprise/entities/value-objects/delivery-with-recipient'
import { PrismaDeliveryWithRecipientMapper } from '../mappers/prisma-delivery-with-recipient-mapper'

@Injectable()
export class PrismaDeliveriesRepository implements DeliveriesRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
    private deliveryConfirmationPhoto: DeliveryConfirmationPhotosRepository,
  ) {}

  async findById(id: string): Promise<Delivery | null> {
    const delivery = await this.prisma.delivery.findUnique({
      where: {
        id,
      },
    })

    if (!delivery) {
      return null
    }

    return PrismaDeliveryMapper.toDomain(delivery)
  }

  async findBySlug(slug: string): Promise<DeliveryWithRecipient | null> {
    const delivery = await this.prisma.delivery.findUnique({
      include: { recipient: true },
      where: {
        slug,
      },
    })

    if (!delivery) {
      return null
    }

    return PrismaDeliveryWithRecipientMapper.toDomain(delivery)
  }

  async save(delivery: Delivery): Promise<void> {
    const data = PrismaDeliveryMapper.toPrisma(delivery)

    await this.prisma.delivery.update({
      where: {
        id: delivery.id.toString(),
      },
      data,
    })

    if (delivery.confirmationPhoto) {
      await this.deliveryConfirmationPhoto.create(delivery.confirmationPhoto)
    }

    DomainEvents.dispatchEventsForAggregate(delivery.id)
  }

  async create(delivery: Delivery): Promise<void> {
    const data = PrismaDeliveryMapper.toPrisma(delivery)

    await this.prisma.delivery.create({
      data,
    })

    if (delivery.confirmationPhoto) {
      await this.deliveryConfirmationPhoto.create(delivery.confirmationPhoto)
    }

    DomainEvents.dispatchEventsForAggregate(delivery.id)
  }

  async findManyByLocation(params: LocationParams): Promise<DeliveryDetails[]> {
    const deliveries = await this.prisma.delivery.findMany({
      include: {
        recipient: true,
      },
      where: {
        status: params.status ? DeliveryStatus[params.status] : undefined,
        recipient: {
          city: params.city,
          state: params.state,
          neighborhood: params.neighborhood,
        },
      },
      skip: (params.page - 1) * 20,
      take: 20,
    })

    return deliveries.map(PrismaDeliveryDetailsMapper.toDomain)
  }

  async findManyByDeliveryman(
    params: DeliverymanParams,
  ): Promise<DeliveryDetails[]> {
    const deliveries = await this.prisma.delivery.findMany({
      include: { recipient: true },
      where: {
        status: params.status ? DeliveryStatus[params.status] : undefined,
        withdrawnBy: params.deliverymanId,
      },
      skip: (params.page - 1) * 20,
      take: 20,
    })

    return deliveries.map(PrismaDeliveryDetailsMapper.toDomain)
  }
}
