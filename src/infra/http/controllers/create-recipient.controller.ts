import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { CreateRecipientUseCase } from '@/domain/warehouse/application/use-cases/create-recipient'
import { Roles } from '@/infra/guards/roles.decorator'

const CreateRecipientBodySchema = z.object({
  name: z.string(),
  city: z.string(),
  neighborhood: z.string(),
  number: z.string().regex(/^\d+$/),
  state: z.string(),
  street: z.string(),
  zipCode: z.string().regex(/^\d{5}-\d{3}$/),
  complement: z.string().optional(),
})

type CreateRecipientBody = z.infer<typeof CreateRecipientBodySchema>

@Controller('/recipients')
export class CreateRecipientController {
  constructor(private createRecipient: CreateRecipientUseCase) {}

  @Post()
  @Roles(['ADMIN'])
  async handle(@Body() body: CreateRecipientBody) {
    const {
      name,
      city,
      neighborhood,
      number,
      state,
      street,
      zipCode,
      complement,
    } = CreateRecipientBodySchema.parse(body)

    const result = await this.createRecipient.execute({
      name,
      city,
      neighborhood,
      number,
      state,
      street,
      zipCode,
      complement,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
