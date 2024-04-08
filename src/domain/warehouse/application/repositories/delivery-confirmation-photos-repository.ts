import { DeliveryConfirmationPhoto } from '../../enterprise/entities/delivery-confirmation-photo'

export abstract class DeliveryConfirmationPhotosRepository {
  abstract create(
    deliveryConfirmationPhoto: DeliveryConfirmationPhoto,
  ): Promise<void>
}
