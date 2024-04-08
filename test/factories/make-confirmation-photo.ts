import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ConfirmationPhoto,
  ConfirmationPhotoProps,
} from '@/domain/warehouse/enterprise/entities/confirmation-photo'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaConfirmationPhotoMapper } from '@/infra/database/prisma/mappers/prisma-confirmation-photo-mapper'

export function makeConfirmationPhoto(
  override: Partial<ConfirmationPhotoProps> = {},
  id?: UniqueEntityID,
) {
  const confirmationPhoto = ConfirmationPhoto.create(
    {
      title: faker.lorem.words(3),
      url: faker.image.url(),
      ...override,
    },
    id,
  )

  return confirmationPhoto
}

@Injectable()
export class ConfirmationPhotoFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaConfirmationPhoto(
    data: Partial<ConfirmationPhotoProps> = {},
  ): Promise<ConfirmationPhoto> {
    const confirmationPhoto = makeConfirmationPhoto(data)

    await this.prisma.confirmationPhoto.create({
      data: PrismaConfirmationPhotoMapper.toPrisma(confirmationPhoto),
    })

    return confirmationPhoto
  }
}
