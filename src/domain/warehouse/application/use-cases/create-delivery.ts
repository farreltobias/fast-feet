import { Either, right } from '@/core/either'
import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries-repository'

interface CreateDeliveryDTO {
  name: string
}

type CreateDeliveryResponse = Either<null, { delivery: Delivery }>

export class CreateDeliveryUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({ name }: CreateDeliveryDTO): Promise<CreateDeliveryResponse> {
    const delivery = Delivery.create({
      name,
    })

    this.deliveriesRepository.create(delivery)

    return right({
      delivery,
    })
  }
}
