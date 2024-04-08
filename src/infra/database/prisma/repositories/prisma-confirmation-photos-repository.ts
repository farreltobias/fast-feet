import { Injectable } from '@nestjs/common'
import { ConfirmationPhotosRepository } from '@/domain/warehouse/application/repositories/confirmation-photos-repository'
import { ConfirmationPhoto } from '@/domain/warehouse/enterprise/entities/confirmation-photo'
import { PrismaService } from '../prisma.service'
import { PrismaConfirmationPhotoMapper } from '../mappers/prisma-confirmation-photo-mapper'

@Injectable()
export class PrismaConfirmationPhotosRepository
  implements ConfirmationPhotosRepository
{
  constructor(private prisma: PrismaService) {}

  async create(confirmationPhoto: ConfirmationPhoto): Promise<void> {
    const data = PrismaConfirmationPhotoMapper.toPrisma(confirmationPhoto)

    await this.prisma.confirmationPhoto.create({
      data,
    })
  }
}
