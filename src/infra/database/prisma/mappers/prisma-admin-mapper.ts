import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin } from '@/domain/warehouse/enterprise/entities/admin'
import { CPF } from '@/domain/warehouse/enterprise/entities/value-objects/cpf'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaAdminMapper {
  static toDomain(raw: PrismaUser): Admin {
    return Admin.create(
      {
        cpf: CPF.create(raw.cpf),
        name: raw.name,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      cpf: admin.cpf.toString(),
      name: admin.name,
      password: admin.password,
      role: 'ADMIN',
    }
  }
}
