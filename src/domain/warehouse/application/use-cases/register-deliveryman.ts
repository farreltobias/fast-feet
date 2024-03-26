import { Either, left, right } from '@/core/either'
import { DeliverymanAlreadyExistsError } from './errors/deliveryman-already-exists-error'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { DeliverymansRepository } from '../repositories/deliverymans-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { InvalidCPFError } from './errors/invalid-cpf-error'

interface RegisterDeliverymanDTO {
  name: string
  cpf: string
  password: string
}

type RegisterDeliverymanResponse = Either<
  InvalidCPFError | DeliverymanAlreadyExistsError,
  { deliveryman: Deliveryman }
>

export class RegisterDeliverymanUseCase {
  constructor(
    private deliverymansRepository: DeliverymansRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: RegisterDeliverymanDTO): Promise<RegisterDeliverymanResponse> {
    const isCPFValid = CPF.validate(cpf)

    if (!isCPFValid) {
      return left(new InvalidCPFError())
    }

    const deliverymanAlreadyExists =
      await this.deliverymansRepository.findByCPF(cpf)

    if (deliverymanAlreadyExists) {
      return left(new DeliverymanAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const deliveryman = Deliveryman.create({
      name,
      cpf: CPF.create(cpf),
      password: hashedPassword,
    })

    await this.deliverymansRepository.create(deliveryman)

    return right({
      deliveryman,
    })
  }
}
