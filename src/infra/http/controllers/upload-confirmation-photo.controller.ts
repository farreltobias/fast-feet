import { InvalidConfirmationPhotoTypeError } from '@/domain/warehouse/application/use-cases/errors/invalid-confirmation-photo-type-error'
import { UploadAndCreateConfirmationPhotoUseCase } from '@/domain/warehouse/application/use-cases/upload-and-create-confirmation-photo'
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
// This is a hack to make Multer available in the Express namespace
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Multer as _ } from 'multer'

@Controller('/confirmation-photos')
export class UploadConfirmationPhotoController {
  constructor(
    private uploadAndCreateConfirmationPhoto: UploadAndCreateConfirmationPhotoUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadAndCreateConfirmationPhoto.execute({
      filename: file.originalname,
      filetype: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidConfirmationPhotoTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { confirmationPhoto } = result.value

    return {
      confirmationPhotoId: confirmationPhoto.id.toString(),
    }
  }
}
