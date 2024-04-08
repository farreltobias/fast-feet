import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'
import { AuthenticateUserUseCase } from '@/domain/warehouse/application/use-cases/authenticate-user'
import { WrongCredentialsError } from '@/domain/warehouse/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'

const AuthenticateBodySchema = z.object({
  cpf: z.string().regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/),
  password: z.string(),
})

type AuthenticateBody = z.infer<typeof AuthenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  async handle(@Body() body: AuthenticateBody) {
    const { cpf, password } = AuthenticateBodySchema.parse(body)

    const result = await this.authenticateUser.execute({
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
