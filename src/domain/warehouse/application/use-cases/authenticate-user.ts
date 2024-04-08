import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { DeliverymansRepository } from '../repositories/deliverymans-repository'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { AdminsRepository } from '../repositories/admins-repository'
import { Admin } from '../../enterprise/entities/admin'

interface AuthenticateUserRequestUseCase {
  cpf: string
  password: string
}

type AuthenticateUserResponseUseCase = Either<
  WrongCredentialsError,
  { accessToken: string }
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private deliverymansRepository: DeliverymansRepository,
    private adminRepository: AdminsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateUserRequestUseCase): Promise<AuthenticateUserResponseUseCase> {
    const deliveryman = await this.deliverymansRepository.findByCPF(cpf)
    const admin = await this.adminRepository.findByCPF(cpf)

    if (!deliveryman && !admin) {
      return left(new WrongCredentialsError())
    }

    const user = {
      role: deliveryman ? 'DELIVERYMAN' : 'ADMIN',
      id: deliveryman ? deliveryman.id : (admin as Admin).id,
      password: deliveryman ? deliveryman.password : (admin as Admin).password,
    }

    const isValidPassword = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!isValidPassword) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      role: user.role,
    })

    return right({
      accessToken,
    })
  }
}
