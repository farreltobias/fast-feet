import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface DeliveryConfirmationPhotoProps {
  deliveryId: UniqueEntityID
  confirmationPhotoId: UniqueEntityID
}

export class DeliveryConfirmationPhoto extends Entity<DeliveryConfirmationPhotoProps> {
  get deliveryId(): UniqueEntityID {
    return this.props.deliveryId
  }

  get confirmationPhotoId(): UniqueEntityID {
    return this.props.confirmationPhotoId
  }

  static create(
    props: DeliveryConfirmationPhotoProps,
    id?: UniqueEntityID,
  ): DeliveryConfirmationPhoto {
    return new DeliveryConfirmationPhoto(props, id)
  }
}
