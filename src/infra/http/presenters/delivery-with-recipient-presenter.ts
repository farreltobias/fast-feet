import { DeliveryWithRecipient } from '@/domain/warehouse/enterprise/entities/value-objects/delivery-with-recipient'
import { DeliveryStatusEnum } from '@/domain/warehouse/enterprise/entities/value-objects/delivery-status'

export class DeliveryWithRecipientPresenter {
  static toHTTP(deliveryWithRecipient: DeliveryWithRecipient) {
    return {
      recipientName: deliveryWithRecipient.recipientName,
      city: deliveryWithRecipient.city,
      state: deliveryWithRecipient.state,
      neighborhood: deliveryWithRecipient.neighborhood,
      street: deliveryWithRecipient.street,
      number: deliveryWithRecipient.number,
      complement: deliveryWithRecipient.complement,
      zipCode: deliveryWithRecipient.zipCode,
      status: DeliveryStatusEnum[deliveryWithRecipient.status.value],
      postedAt: deliveryWithRecipient.postedAt,
      withdrawnAt: deliveryWithRecipient.withdrawnAt,
      deliveredAt: deliveryWithRecipient.deliveredAt,
    }
  }
}
