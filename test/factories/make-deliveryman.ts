import { faker } from '@faker-js/faker'
import fakerBr from 'faker-br'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Deliveryman,
  DeliverymanProps,
} from '@/domain/warehouse/enterprise/entities/deliveryman'
import { CPF } from '@/domain/warehouse/enterprise/entities/value-objects/cpf'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaDeliverymanMapper } from '@/infra/database/prisma/mappers/prisma-deliveryman-mapper'

export function makeDeliveryman(
  override: Partial<DeliverymanProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryman = Deliveryman.create(
    {
      cpf: CPF.create(fakerBr.br.cpf()),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return deliveryman
}

@Injectable()
export class DeliverymanFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryman(
    data: Partial<DeliverymanProps> = {},
  ): Promise<Deliveryman> {
    const deliveryman = makeDeliveryman(data)

    await this.prisma.user.create({
      data: PrismaDeliverymanMapper.toPrisma(deliveryman),
    })

    return deliveryman
  }
}
