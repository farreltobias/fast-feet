import { ConfirmationPhoto } from '../../enterprise/entities/confirmation-photo'

export interface ConfirmationPhotosRepository {
  create(ConfirmationPhoto: ConfirmationPhoto): Promise<void>
}
