import { BadRequestException, Controller, Param, Patch } from '@nestjs/common'
import { ReturnDeliveryUseCase } from '@/domain/warehouse/application/use-cases/return-delivery'
import { Roles } from '@/infra/guards/roles.decorator'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/deliveries/:deliveryId/return')
export class ReturnDeliveryController {
  constructor(private returnDelivery: ReturnDeliveryUseCase) {}

  @Patch()
  @Roles(['ADMIN'])
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('deliveryId') deliveryId: string,
  ) {
    const { sub: adminId } = user

    const result = await this.returnDelivery.execute({
      deliveryId,
      adminId,
    })

    if (result.isLeft()) {
      const error = result.value
      throw new BadRequestException(error.message)
    }
  }
}
