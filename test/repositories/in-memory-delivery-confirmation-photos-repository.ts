import { DeliveryConfirmationPhotosRepository } from '@/domain/warehouse/application/repositories/delivery-confirmation-photos-repository'
import { DeliveryConfirmationPhoto } from '@/domain/warehouse/enterprise/entities/delivery-confirmation-photo'

export class InMemoryDeliveryConfirmationPhotosRepository
  implements DeliveryConfirmationPhotosRepository
{
  public items: DeliveryConfirmationPhoto[] = []

  async create(deliveryConfirmationPhoto: DeliveryConfirmationPhoto) {
    this.items.push(deliveryConfirmationPhoto)
  }
}
