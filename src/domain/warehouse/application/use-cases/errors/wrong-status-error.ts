import { UseCaseError } from '@/core/errors/use-case-error'

export class WrongStatusError extends Error implements UseCaseError {
  constructor() {
    super('Previous status does not allow this action.')
  }
}
