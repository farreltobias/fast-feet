import { faker } from '@faker-js/faker'
import fakerBr from 'faker-br'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin, AdminProps } from '@/domain/warehouse/enterprise/entities/admin'
import { CPF } from '@/domain/warehouse/enterprise/entities/value-objects/cpf'
// import { Injectable } from '@nestjs/common'
// import { PrismaService } from '@/infra/database/prisma/prisma.service'
// import { PrismaAdminMapper } from '@/infra/database/prisma/mappers/prisma-admin-mapper'

export function makeAdmin(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID,
) {
  const admin = Admin.create(
    {
      cpf: CPF.create(fakerBr.br.cpf()),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return admin
}

// @Injectable()
// export class AdminFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaAdmin(
//     data: Partial<AdminProps> = {},
//   ): Promise<Admin> {
//     const admin = makeAdmin(data)

//     await this.prisma.user.create({
//       data: PrismaAdminMapper.toPrisma(admin),
//     })

//     return admin
//   }
// }
