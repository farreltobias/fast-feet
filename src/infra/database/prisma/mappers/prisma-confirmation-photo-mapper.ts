import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ConfirmationPhoto } from '@/domain/warehouse/enterprise/entities/confirmation-photo'
import {
  Prisma,
  ConfirmationPhoto as PrismaConfirmationPhoto,
} from '@prisma/client'

export class PrismaConfirmationPhotoMapper {
  static toDomain(raw: PrismaConfirmationPhoto): ConfirmationPhoto {
    return ConfirmationPhoto.create(
      {
        title: raw.title,
        url: raw.url,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    confirmationPhoto: ConfirmationPhoto,
  ): Prisma.ConfirmationPhotoUncheckedCreateInput {
    return {
      id: confirmationPhoto.id.toString(),
      title: confirmationPhoto.title,
      url: confirmationPhoto.url,
    }
  }
}
