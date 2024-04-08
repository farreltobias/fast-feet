import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { CreateDeliveryUseCase } from '@/domain/warehouse/application/use-cases/create-delivery'
import { Roles } from '@/infra/guards/roles.decorator'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const CreateDeliveryBodySchema = z.object({
  name: z.string(),
})

type CreateDeliveryBody = z.infer<typeof CreateDeliveryBodySchema>

@Controller('/deliveries')
export class CreateDeliveryController {
  constructor(private createDelivery: CreateDeliveryUseCase) {}

  @Post()
  @Roles(['ADMIN'])
  async handle(
    @Body() body: CreateDeliveryBody,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub: adminId } = user

    const { name } = CreateDeliveryBodySchema.parse(body)

    const result = await this.createDelivery.execute({
      adminId,
      name,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
