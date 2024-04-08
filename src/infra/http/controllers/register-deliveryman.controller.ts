import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { RegisterDeliverymanUseCase } from '@/domain/warehouse/application/use-cases/register-deliveryman'
import { Roles } from '@/infra/guards/roles.decorator'

const RegisterDeliverymanBodySchema = z.object({
  name: z.string(),
  cpf: z.string().regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/),
  password: z.string(),
})

type RegisterDeliverymanBody = z.infer<typeof RegisterDeliverymanBodySchema>

@Controller('/deliverymans')
export class RegisterDeliverymanController {
  constructor(private registerDeliveryman: RegisterDeliverymanUseCase) {}

  @Post()
  @Roles(['ADMIN'])
  async handle(@Body() body: RegisterDeliverymanBody) {
    const { name, cpf, password } = RegisterDeliverymanBodySchema.parse(body)

    const result = await this.registerDeliveryman.execute({
      cpf,
      name,
      password,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
