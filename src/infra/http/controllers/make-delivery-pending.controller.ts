import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'
import { MakeDeliveryPendingUseCase } from '@/domain/warehouse/application/use-cases/make-delivery-pending'
import { Roles } from '@/infra/guards/roles.decorator'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const MakeDeliveryPendingBodySchema = z.object({
  postedTo: z.string().uuid(),
})

type MakeDeliveryPendingBody = z.infer<typeof MakeDeliveryPendingBodySchema>

@Controller('/deliveries/:deliveryId/mark-pending')
export class MakeDeliveryPendingController {
  constructor(private makeDeliveryPending: MakeDeliveryPendingUseCase) {}

  @Patch()
  @Roles(['ADMIN'])
  async handle(
    @Body() body: MakeDeliveryPendingBody,
    @CurrentUser() user: UserPayload,
    @Param('deliveryId') deliveryId: string,
  ) {
    const { sub: adminId } = user

    const { postedTo } = MakeDeliveryPendingBodySchema.parse(body)

    const result = await this.makeDeliveryPending.execute({
      deliveryId,
      adminId,
      postedTo,
    })

    if (result.isLeft()) {
      const error = result.value
      throw new BadRequestException(error.message)
    }
  }
}
