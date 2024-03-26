import { Either, right } from '@/core/either'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { DeliveryWithLocation } from '../../enterprise/entities/value-objects/delivery-with-location'
import { DeliveryStatusEnum } from '../../enterprise/entities/value-objects/delivery-status'

interface FetchPendingDeliveriesNearbyDTO {
  state: string
  city: string
  neighborhood?: string
  page: number
}

type FetchPendingDeliveriesNearbyResponse = Either<
  null,
  { deliveries: DeliveryWithLocation[] }
>

export class FetchPendingDeliveriesNearbyUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    city,
    state,
    neighborhood,
    page,
  }: FetchPendingDeliveriesNearbyDTO): Promise<FetchPendingDeliveriesNearbyResponse> {
    const deliveries = await this.deliveriesRepository.findManyByLocation({
      city,
      state,
      neighborhood,
      page,
      status: DeliveryStatusEnum.PENDING,
    })

    return right({ deliveries })
  }
}
