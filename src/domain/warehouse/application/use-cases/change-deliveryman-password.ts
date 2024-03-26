import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { DeliverymansRepository } from '../repositories/deliverymans-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Deliveryman } from '../../enterprise/entities/deliveryman'

interface ChangeDeliverymanPasswordRequestUseCase {
  cpf: string
  newPassword: string
}

type ChangeDeliverymanPasswordResponseUseCase = Either<
  ResourceNotFoundError,
  { deliveryman: Deliveryman }
>

@Injectable()
export class ChangeDeliverymanPasswordUseCase {
  constructor(
    private deliverymansRepository: DeliverymansRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    cpf,
    newPassword,
  }: ChangeDeliverymanPasswordRequestUseCase): Promise<ChangeDeliverymanPasswordResponseUseCase> {
    const deliveryman = await this.deliverymansRepository.findByCPF(cpf)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    const hashedPassword = await this.hashGenerator.hash(newPassword)

    deliveryman.password = hashedPassword

    await this.deliverymansRepository.save(deliveryman)

    return right({
      deliveryman,
    })
  }
}
