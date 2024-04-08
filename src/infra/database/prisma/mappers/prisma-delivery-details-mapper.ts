import { DeliveryDetails } from '@/domain/warehouse/enterprise/entities/value-objects/delivery-details'
import {
  DeliveryStatus,
  DeliveryStatusEnum,
} from '@/domain/warehouse/enterprise/entities/value-objects/delivery-status'
import { Slug } from '@/domain/warehouse/enterprise/entities/value-objects/slug'
import {
  Delivery as PrismaDelivery,
  Recipient as PrismaRecipient,
} from '@prisma/client'

type PrismaDeliveryDetails = PrismaDelivery & {
  recipient: PrismaRecipient | null
}

export class PrismaDeliveryDetailsMapper {
  static toDomain(raw: PrismaDeliveryDetails): DeliveryDetails {
    if (!raw.recipient) {
      throw new Error('Invalid delivery status.')
    }

    return DeliveryDetails.create({
      name: raw.name,
      slug: Slug.create(raw.slug),
      status: DeliveryStatus.create(DeliveryStatusEnum[raw.status]),
      neighborhood: raw.recipient.neighborhood,
      city: raw.recipient.city,
      state: raw.recipient.state,
      updatedAt: raw.updatedAt,
    })
  }
}
