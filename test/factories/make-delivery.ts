import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Delivery,
  DeliveryProps,
} from '@/domain/warehouse/enterprise/entities/delivery'
// import { Injectable } from '@nestjs/common'
// import { PrismaService } from '@/infra/database/prisma/prisma.service'
// import { PrismaDeliveryMapper } from '@/infra/database/prisma/mappers/prisma-delivery-mapper'

export function makeDelivery(
  override: Partial<DeliveryProps> = {},
  id?: UniqueEntityID,
) {
  const delivery = Delivery.create(
    {
      name: faker.commerce.productName(),
      ...override,
    },
    id,
  )

  return delivery
}

// @Injectable()
// export class DeliveryFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaDelivery(
//     data: Partial<DeliveryProps> = {},
//   ): Promise<Delivery> {
//     const delivery = makeDelivery(data)

//     await this.prisma.user.create({
//       data: PrismaDeliveryMapper.toPrisma(delivery),
//     })

//     return delivery
//   }
// }
