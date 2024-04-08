import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Delivery } from '@/domain/warehouse/enterprise/entities/delivery'
import {
  DeliveryStatus,
  DeliveryStatusEnum,
} from '@/domain/warehouse/enterprise/entities/value-objects/delivery-status'
import { Slug } from '@/domain/warehouse/enterprise/entities/value-objects/slug'
import {
  Prisma,
  Delivery as PrismaDelivery,
  DeliveryStatus as PrismaDeliveryStatus,
} from '@prisma/client'

export class PrismaDeliveryMapper {
  static toDomain(raw: PrismaDelivery): Delivery {
    return Delivery.create(
      {
        name: raw.name,
        slug: Slug.create(raw.slug),
        status: DeliveryStatus.create(DeliveryStatusEnum[raw.status]),
        createdBy: new UniqueEntityID(raw.createdBy),
        postedAt: raw.postedAt,
        postedTo: raw.postedTo ? new UniqueEntityID(raw.postedTo) : null,
        withdrawnAt: raw.withdrawnAt,
        withdrawnBy: raw.withdrawnBy
          ? new UniqueEntityID(raw.withdrawnBy)
          : null,
        deliveredAt: raw.deliveredAt,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(delivery: Delivery): Prisma.DeliveryUncheckedCreateInput {
    return {
      id: delivery.id.toString(),
      name: delivery.name,
      slug: delivery.slug.value,
      status: PrismaDeliveryStatus[DeliveryStatusEnum[delivery.status.value]],
      createdBy: delivery.createdBy.toString(),
      postedAt: delivery.postedAt,
      postedTo: delivery.postedTo?.toString(),
      withdrawnAt: delivery.withdrawnAt,
      withdrawnBy: delivery.withdrawnBy?.toString(),
      deliveredAt: delivery.deliveredAt,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt,
    }
  }
}
