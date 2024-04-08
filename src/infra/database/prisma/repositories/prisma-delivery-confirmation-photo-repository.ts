import { DeliveryConfirmationPhotosRepository } from '@/domain/warehouse/application/repositories/delivery-confirmation-photos-repository'
import { DeliveryConfirmationPhoto } from '@/domain/warehouse/enterprise/entities/delivery-confirmation-photo'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaDeliveryConfirmationPhotosRepository
  implements DeliveryConfirmationPhotosRepository
{
  constructor(private prisma: PrismaService) {}

  async create(
    deliveryConfirmationPhoto: DeliveryConfirmationPhoto,
  ): Promise<void> {
    await this.prisma.confirmationPhoto.update({
      where: {
        id: deliveryConfirmationPhoto.confirmationPhotoId.toString(),
      },
      data: {
        deliveryId: deliveryConfirmationPhoto.deliveryId.toString(),
      },
    })
  }
}
