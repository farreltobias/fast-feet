import { Either, left, right } from '@/core/either'
import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { WrongStatusError } from './errors/wrong-status-error'
import { DeliveryStatusEnum } from '../../enterprise/entities/value-objects/delivery-status'
import { AdminsRepository } from '../repositories/admins-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { RecipientsRepository } from '../repositories/recipients-repository'

interface MakeDeliveryPendingDTO {
  deliveryId: string
  recipientId: string
  adminId: string
}

type MakeDeliveryPendingResponse = Either<
  ResourceNotFoundError,
  { delivery: Delivery }
>

export class MakeDeliveryPendingUseCase {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private adminsRepository: AdminsRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    deliveryId,
    recipientId,
    adminId,
  }: MakeDeliveryPendingDTO): Promise<MakeDeliveryPendingResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    if (!delivery.status.isValid(DeliveryStatusEnum.PENDING)) {
      return left(new WrongStatusError())
    }

    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    delivery.recipientId = recipient.id
    await this.deliveriesRepository.save(delivery)

    return right({ delivery })
  }
}
