import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { FetchDeliveriesByDeliverymanUseCase } from '@/domain/warehouse/application/use-cases/fetch-deliveries-by-deliveryman'
import { Roles } from '@/infra/guards/roles.decorator'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeliveryStatusEnum } from '@/domain/warehouse/enterprise/entities/value-objects/delivery-status'
import { DeliveryDetailsPresenter } from '../presenters/delivery-details-presenter'

const FetchDeliveriesByDeliverymanQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  status: z.nativeEnum(DeliveryStatusEnum).optional(),
})

type FetchDeliveriesByDeliverymanQuery = z.infer<
  typeof FetchDeliveriesByDeliverymanQuerySchema
>

@Controller('/deliveries')
export class FetchDeliveriesByDeliverymanController {
  constructor(
    private fetchDeliveriesByDeliveryman: FetchDeliveriesByDeliverymanUseCase,
  ) {}

  @Get()
  @Roles(['DELIVERYMAN'])
  async handle(
    @Query() query: FetchDeliveriesByDeliverymanQuery,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub: deliverymanId } = user

    const { page, status } =
      FetchDeliveriesByDeliverymanQuerySchema.parse(query)

    const result = await this.fetchDeliveriesByDeliveryman.execute({
      deliverymanId,
      page,
      status,
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
