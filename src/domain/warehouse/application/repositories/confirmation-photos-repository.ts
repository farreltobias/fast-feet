import { ConfirmationPhoto } from '../../enterprise/entities/confirmation-photo'

export abstract class ConfirmationPhotosRepository {
  abstract create(confirmationPhoto: ConfirmationPhoto): Promise<void>
}
