import { Either, left, right } from '@/core/either'
import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { AdminsRepository } from '../repositories/admins-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface CreateDeliveryDTO {
  name: string
  adminId: string
}

type CreateDeliveryResponse = Either<
  ResourceNotFoundError,
  { delivery: Delivery }
>

@Injectable()
export class CreateDeliveryUseCase {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    name,
    adminId,
  }: CreateDeliveryDTO): Promise<CreateDeliveryResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    const delivery = Delivery.create({
      name,
      createdBy: admin.id,
    })

    this.deliveriesRepository.create(delivery)

    return right({
      delivery,
    })
  }
}
