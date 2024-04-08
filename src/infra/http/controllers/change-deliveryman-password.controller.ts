import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'
import { ChangeDeliverymanPasswordUseCase } from '@/domain/warehouse/application/use-cases/change-deliveryman-password'
import { Roles } from '@/infra/guards/roles.decorator'

const ChangePasswordBodySchema = z.object({
  password: z.string(),
})

type ChangePasswordBody = z.infer<typeof ChangePasswordBodySchema>

@Controller('/deliveryman/:cpf/change-password')
export class ChangePasswordController {
  constructor(
    private changeDeliverymanPassword: ChangeDeliverymanPasswordUseCase,
  ) {}

  @Patch()
  @Roles(['ADMIN'])
  @HttpCode(204)
  async handle(@Body() body: ChangePasswordBody, @Param('cpf') cpf: string) {
    const { password } = ChangePasswordBodySchema.parse(body)

    const result = await this.changeDeliverymanPassword.execute({
      cpf,
      newPassword: password,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
