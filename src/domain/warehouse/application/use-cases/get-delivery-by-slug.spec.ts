import { makeDelivery } from 'test/factories/make-delivery'
import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { GetDeliveryBySlugUseCase } from './get-delivery-by-slug'
import { InMemoryDeliveryConfirmationPhotosRepository } from 'test/repositories/in-memory-delivery-confirmation-photos-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import {
  DeliveryStatus,
  DeliveryStatusEnum,
} from '../../enterprise/entities/value-objects/delivery-status'

let inMemoryDeliveryConfirmationPhotosRepository: InMemoryDeliveryConfirmationPhotosRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let sut: GetDeliveryBySlugUseCase

describe('Get Delivery By Slug', () => {
  beforeEach(() => {
    inMemoryDeliveryConfirmationPhotosRepository =
      new InMemoryDeliveryConfirmationPhotosRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()

    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryDeliveryConfirmationPhotosRepository,
      inMemoryRecipientsRepository,
    )
    sut = new GetDeliveryBySlugUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to get a delivery with recipient by slug', async () => {
    const recipient = makeRecipient({ name: 'John Doe' })

    inMemoryRecipientsRepository.items.push(recipient)

    const newDelivery = makeDelivery({
      postedTo: recipient.id,
      slug: Slug.create('example-delivery'),
      status: DeliveryStatus.create(DeliveryStatusEnum.PENDING),
      postedAt: new Date(),
    })

    inMemoryDeliveriesRepository.items.push(newDelivery)

    const result = await sut.execute({
      slug: 'example-delivery',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      delivery: expect.objectContaining({
        recipientName: 'John Doe',
        status: newDelivery.status,
        postedAt: newDelivery.postedAt,
      }),
    })
  })
})
