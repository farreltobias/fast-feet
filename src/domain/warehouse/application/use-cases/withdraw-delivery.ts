import { Either, left, right } from '@/core/either'
import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DeliverymansRepository } from '../repositories/deliverymans-repository'
import { WrongStatusError } from './errors/wrong-status-error'
import { DeliveryStatusEnum } from '../../enterprise/entities/value-objects/delivery-status'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface WithdrawDeliveryDTO {
  deliveryId: string
  deliverymanId: string
}

type WithdrawDeliveryResponse = Either<
  ResourceNotFoundError,
  { delivery: Delivery }
>

@Injectable()
export class WithdrawDeliveryUseCase {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private deliverymansRepository: DeliverymansRepository,
  ) {}

  async execute({
    deliveryId,
    deliverymanId,
  }: WithdrawDeliveryDTO): Promise<WithdrawDeliveryResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    if (!delivery.status.isValid(DeliveryStatusEnum.WITHDRAWN)) {
      return left(new WrongStatusError())
    }

    const deliveryman =
      await this.deliverymansRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new NotAllowedError())
    }

    delivery.withdrawnBy = deliveryman.id

    await this.deliveriesRepository.save(delivery)

    return right({ delivery })
  }
}
