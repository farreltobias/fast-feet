import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { InvalidConfirmationPhotoTypeError } from './errors/invalid-confirmation-photo-type-error'
import { ConfirmationPhoto } from '../../enterprise/entities/confirmation-photo'
import { ConfirmationPhotosRepository } from '../repositories/confirmation-photos-repository'
import { Uploader } from '../storage/uploader'

interface UploadAndCreateConfirmationPhotoRequestUseCase {
  filename: string
  filetype: string
  body: Buffer
}

type UploadAndCreateConfirmationPhotoResponseUseCase = Either<
  InvalidConfirmationPhotoTypeError,
  { confirmationPhoto: ConfirmationPhoto }
>

@Injectable()
export class UploadAndCreateConfirmationPhotoUseCase {
  constructor(
    private confirmationPhotosRepository: ConfirmationPhotosRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    filename,
    filetype,
    body,
  }: UploadAndCreateConfirmationPhotoRequestUseCase): Promise<UploadAndCreateConfirmationPhotoResponseUseCase> {
    if (!/^(image\/(jpg|jpeg|png))$/.test(filetype)) {
      return left(new InvalidConfirmationPhotoTypeError(filetype))
    }

    const { url } = await this.uploader.upload({
      filename,
      filetype,
      body,
    })

    const confirmationPhoto = ConfirmationPhoto.create({
      title: filename,
      url,
    })

    await this.confirmationPhotosRepository.create(confirmationPhoto)

    return right({
      confirmationPhoto,
    })
  }
}
