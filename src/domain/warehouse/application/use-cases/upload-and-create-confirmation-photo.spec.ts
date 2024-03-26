import { InMemoryConfirmationPhotosRepository } from 'test/repositories/in-memory-confirmation-photos-repository'
import { UploadAndCreateConfirmationPhotoUseCase } from './upload-and-create-confirmation-photo'
import { FakeUploader } from 'test/storage/uploader'
import { InvalidConfirmationPhotoTypeError } from './errors/invalid-confirmation-photo-type-error'

let inMemoryConfirmationPhotosRepository: InMemoryConfirmationPhotosRepository
let fakeUploader: FakeUploader

let sut: UploadAndCreateConfirmationPhotoUseCase

describe('Upload and create confirmation photo', () => {
  beforeEach(() => {
    inMemoryConfirmationPhotosRepository =
      new InMemoryConfirmationPhotosRepository()
    fakeUploader = new FakeUploader()

    sut = new UploadAndCreateConfirmationPhotoUseCase(
      inMemoryConfirmationPhotosRepository,
      fakeUploader,
    )
  })

  it('should be able to upload and create confirmation photo', async () => {
    const result = await sut.execute({
      filename: 'example.png',
      filetype: 'image/png',
      body: Buffer.from('example'),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      confirmationPhoto: inMemoryConfirmationPhotosRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual({
      filename: 'example.png',
      url: expect.any(String),
    })
  })

  it('should not be able to upload an confirmation photo with invalid file type', async () => {
    const result = await sut.execute({
      filename: 'example.mp3',
      filetype: 'image/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidConfirmationPhotoTypeError)
  })
})
