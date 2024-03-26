import { Either, right } from '@/core/either'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { DeliveryWithLocation } from '../../enterprise/entities/value-objects/delivery-with-location'
import { DeliveryStatusEnum } from '../../enterprise/entities/value-objects/delivery-status'

interface FetchDeliveriesByDeliverymanDTO {
  deliverymanId: string
  status?: DeliveryStatusEnum
  page: number
}

type FetchDeliveriesByDeliverymanResponse = Either<
  null,
  { deliveries: DeliveryWithLocation[] }
>

export class FetchDeliveriesByDeliverymanUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    deliverymanId,
    status,
    page,
  }: FetchDeliveriesByDeliverymanDTO): Promise<FetchDeliveriesByDeliverymanResponse> {
    const deliveries = await this.deliveriesRepository.findManyByDeliveryman({
      page,
      status,
      deliverymanId,
    })

    return right({ deliveries })
  }
}
