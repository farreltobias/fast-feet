import { DeliveryDetails } from '@/domain/warehouse/enterprise/entities/value-objects/delivery-details'
import { DeliveryStatusEnum } from '@/domain/warehouse/enterprise/entities/value-objects/delivery-status'

export class DeliveryDetailsPresenter {
  static toHTTP(deliveryDetails: DeliveryDetails) {
    return {
      name: deliveryDetails.name,
      slug: deliveryDetails.slug.value,
      status: DeliveryStatusEnum[deliveryDetails.status.value],
      neighborhood: deliveryDetails.neighborhood,
      city: deliveryDetails.city,
      state: deliveryDetails.state,
      updatedAt: deliveryDetails.updatedAt,
    }
  }
}
