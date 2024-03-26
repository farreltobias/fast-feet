import { Either, left, right } from '@/core/either'
import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { WrongStatusError } from './errors/wrong-status-error'
import { DeliveryStatusEnum } from '../../enterprise/entities/value-objects/delivery-status'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { DeliveryConfirmationPhoto } from '../../enterprise/entities/delivery-confirmation-photo'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface DeliverDeliveryDTO {
  deliveryId: string
  deliverymanId: string
  confirmationPhotoId: string
}

type DeliverDeliveryResponse = Either<
  ResourceNotFoundError,
  { delivery: Delivery }
>

export class DeliverDeliveryUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    deliveryId,
    deliverymanId,
    confirmationPhotoId,
  }: DeliverDeliveryDTO): Promise<DeliverDeliveryResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    if (!delivery.status.isValid(DeliveryStatusEnum.DELIVERED)) {
      return left(new WrongStatusError())
    }

    if (delivery.withdrawnBy?.toString() !== deliverymanId) {
      return left(new NotAllowedError())
    }

    delivery.confirmationPhoto = DeliveryConfirmationPhoto.create({
      confirmationPhotoId: new UniqueEntityID(confirmationPhotoId),
      deliveryId: delivery.id,
    })

    await this.deliveriesRepository.save(delivery)

    return right({ delivery })
  }
}
