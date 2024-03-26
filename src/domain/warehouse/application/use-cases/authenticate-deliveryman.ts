import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { DeliverymansRepository } from '../repositories/deliverymans-repository'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateDeliverymanRequestUseCase {
  cpf: string
  password: string
}

type AuthenticateDeliverymanResponseUseCase = Either<
  WrongCredentialsError,
  { accessToken: string }
>

@Injectable()
export class AuthenticateDeliverymanUseCase {
  constructor(
    private deliverymansRepository: DeliverymansRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateDeliverymanRequestUseCase): Promise<AuthenticateDeliverymanResponseUseCase> {
    const deliveryman = await this.deliverymansRepository.findByCPF(cpf)

    if (!deliveryman) {
      return left(new WrongCredentialsError())
    }

    const isValidPassword = await this.hashComparer.compare(
      password,
      deliveryman.password,
    )

    if (!isValidPassword) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: deliveryman.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
