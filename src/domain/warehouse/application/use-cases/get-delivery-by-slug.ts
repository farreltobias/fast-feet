import { Either, left, right } from '@/core/either'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DeliveryWithRecipient } from '../../enterprise/entities/value-objects/delivery-with-recipient'
import { Injectable } from '@nestjs/common'

interface GetDeliveryBySlugDTO {
  slug: string
}

type GetDeliveryBySlugResponse = Either<
  ResourceNotFoundError,
  { delivery: DeliveryWithRecipient }
>

@Injectable()
export class GetDeliveryBySlugUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    slug,
  }: GetDeliveryBySlugDTO): Promise<GetDeliveryBySlugResponse> {
    const delivery = await this.deliveriesRepository.findBySlug(slug)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    return right({ delivery })
  }
}
