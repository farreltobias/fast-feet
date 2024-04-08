import { Either, left, right } from '@/core/either'
import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { WrongStatusError } from './errors/wrong-status-error'
import {
  DeliveryStatus,
  DeliveryStatusEnum,
} from '../../enterprise/entities/value-objects/delivery-status'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { AdminsRepository } from '../repositories/admins-repository'
import { Injectable } from '@nestjs/common'

interface ReturnDeliveryDTO {
  deliveryId: string
  adminId: string
}

type ReturnDeliveryResponse = Either<
  ResourceNotFoundError,
  { delivery: Delivery }
>

@Injectable()
export class ReturnDeliveryUseCase {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    deliveryId,
    adminId,
  }: ReturnDeliveryDTO): Promise<ReturnDeliveryResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    if (!delivery.status.isValid(DeliveryStatusEnum.RETURNED)) {
      return left(new WrongStatusError())
    }

    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    delivery.status = DeliveryStatus.create(DeliveryStatusEnum.RETURNED)

    await this.deliveriesRepository.save(delivery)

    return right({ delivery })
  }
}
