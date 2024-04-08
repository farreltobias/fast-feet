import { BadRequestException, Controller, Param, Patch } from '@nestjs/common'
import { WithdrawDeliveryUseCase } from '@/domain/warehouse/application/use-cases/withdraw-delivery'
import { Roles } from '@/infra/guards/roles.decorator'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/deliveries/:deliveryId/withdraw')
export class WithdrawDeliveryController {
  constructor(private withdrawDelivery: WithdrawDeliveryUseCase) {}

  @Patch()
  @Roles(['DELIVERYMAN'])
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('deliveryId') deliveryId: string,
  ) {
    const { sub: deliverymanId } = user

    const result = await this.withdrawDelivery.execute({
      deliveryId,
      deliverymanId,
    })

    if (result.isLeft()) {
      const error = result.value
      throw new BadRequestException(error.message)
    }
  }
}
