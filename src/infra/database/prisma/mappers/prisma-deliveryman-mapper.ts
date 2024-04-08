import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Deliveryman } from '@/domain/warehouse/enterprise/entities/deliveryman'
import { CPF } from '@/domain/warehouse/enterprise/entities/value-objects/cpf'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaDeliverymanMapper {
  static toDomain(raw: PrismaUser): Deliveryman {
    return Deliveryman.create(
      {
        cpf: CPF.create(raw.cpf),
        name: raw.name,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(deliveryman: Deliveryman): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryman.id.toString(),
      role: 'DELIVERYMAN',
      cpf: deliveryman.cpf.toString(),
      name: deliveryman.name,
      password: deliveryman.password,
    }
  }
}
