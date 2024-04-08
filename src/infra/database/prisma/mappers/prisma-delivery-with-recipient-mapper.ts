import { DeliveryWithRecipient } from '@/domain/warehouse/enterprise/entities/value-objects/delivery-with-recipient'
import {
  DeliveryStatus,
  DeliveryStatusEnum,
} from '@/domain/warehouse/enterprise/entities/value-objects/delivery-status'
import {
  Delivery as PrismaDelivery,
  Recipient as PrismaRecipient,
} from '@prisma/client'

type PrismaDeliveryWithRecipient = PrismaDelivery & {
  recipient: PrismaRecipient | null
}

export class PrismaDeliveryWithRecipientMapper {
  static toDomain(raw: PrismaDeliveryWithRecipient): DeliveryWithRecipient {
    if (!raw.recipient) {
      throw new Error('Invalid delivery status.')
    }

    return DeliveryWithRecipient.create({
      recipientName: raw.recipient.name,
      street: raw.recipient.street,
      number: raw.recipient.number,
      complement: raw.recipient.complement,
      neighborhood: raw.recipient.neighborhood,
      city: raw.recipient.city,
      state: raw.recipient.state,
      zipCode: raw.recipient.zipCode,
      status: DeliveryStatus.create(DeliveryStatusEnum[raw.status]),
      postedAt: raw.postedAt,
      withdrawnAt: raw.withdrawnAt,
      deliveredAt: raw.deliveredAt,
    })
  }
}
