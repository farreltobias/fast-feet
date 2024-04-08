import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { FetchPendingDeliveriesNearbyUseCase } from '@/domain/warehouse/application/use-cases/fetch-pending-deliveries-nearby'
import { DeliveryDetailsPresenter } from '../presenters/delivery-details-presenter'

const FetchPendingDeliveriesQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  city: z.string(),
  state: z.string(),
  neighborhood: z.string().optional(),
})

type FetchPendingDeliveriesQuery = z.infer<
  typeof FetchPendingDeliveriesQuerySchema
>

@Controller('/deliveries/pending-nearby')
export class FetchPendingDeliveriesNearbyController {
  constructor(
    private fetchPendingDeliveriesNearby: FetchPendingDeliveriesNearbyUseCase,
  ) {}

  @Get()
  async handle(@Query() query: FetchPendingDeliveriesQuery) {
    const { page, city, state, neighborhood } =
      FetchPendingDeliveriesQuerySchema.parse(query)

    const result = await this.fetchPendingDeliveriesNearby.execute({
      page,
      city,
      state,
      neighborhood,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { deliveries } = result.value

    return {
      deliveries: deliveries.map(DeliveryDetailsPresenter.toHTTP),
    }
  }
}
