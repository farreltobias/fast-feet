import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'
import { DeliverDeliveryUseCase } from '@/domain/warehouse/application/use-cases/deliver-delivery'
import { Roles } from '@/infra/guards/roles.decorator'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const DeliverDeliveryBodySchema = z.object({
  confirmationPhotoId: z.string().uuid(),
})

type DeliverDeliveryBody = z.infer<typeof DeliverDeliveryBodySchema>

@Controller('/deliveries/:deliveryId/deliver')
export class DeliverDeliveryController {
  constructor(private deliverDelivery: DeliverDeliveryUseCase) {}

  @Patch()
  @Roles(['DELIVERYMAN'])
  async handle(
    @Body() body: DeliverDeliveryBody,
    @CurrentUser() user: UserPayload,
    @Param('deliveryId') deliveryId: string,
  ) {
    const { sub: deliverymanId } = user

    const { confirmationPhotoId } = DeliverDeliveryBodySchema.parse(body)

    const result = await this.deliverDelivery.execute({
      deliveryId,
      deliverymanId,
      confirmationPhotoId,
    })

    if (result.isLeft()) {
      const error = result.value
      throw new BadRequestException(error.message)
    }
  }
}
