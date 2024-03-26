import { DeliveryConfirmationPhoto } from '../../enterprise/entities/delivery-confirmation-photo'

export interface DeliveryConfirmationPhotosRepository {
  create(deliveryConfirmationPhoto: DeliveryConfirmationPhoto): Promise<void>
}
