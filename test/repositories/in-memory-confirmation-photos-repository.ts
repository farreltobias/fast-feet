import { ConfirmationPhotosRepository } from '@/domain/warehouse/application/repositories/confirmation-photos-repository'
import { ConfirmationPhoto } from '@/domain/warehouse/enterprise/entities/confirmation-photo'

export class InMemoryConfirmationPhotosRepository
  implements ConfirmationPhotosRepository
{
  public items: ConfirmationPhoto[] = []

  async create(ConfirmationPhoto: ConfirmationPhoto) {
    this.items.push(ConfirmationPhoto)
  }
}
