import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository'
import { DeliverDeliveryUseCase } from './deliver-delivery'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { makeDelivery } from 'test/factories/make-delivery'
import {
  DeliveryStatus,
  DeliveryStatusEnum,
} from '../../enterprise/entities/value-objects/delivery-status'
import { InMemoryDeliveryConfirmationPhotosRepository } from 'test/repositories/in-memory-delivery-confirmation-photos-repository'
import { WrongStatusError } from './errors/wrong-status-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

let inMemoryDeliveryConfirmationPhotosRepository: InMemoryDeliveryConfirmationPhotosRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let sut: DeliverDeliveryUseCase

describe('Deliver Delivery', () => {
  beforeEach(() => {
    inMemoryDeliveryConfirmationPhotosRepository =
      new InMemoryDeliveryConfirmationPhotosRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryDeliveryConfirmationPhotosRepository,
      inMemoryRecipientsRepository,
    )
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    sut = new DeliverDeliveryUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to deliver a delivery', async () => {
    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const delivery = makeDelivery({
      status: DeliveryStatus.create(DeliveryStatusEnum.WITHDRAWN),
      withdrawnBy: deliveryman.id,
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      deliveryId: delivery.id.toString(),
      confirmationPhotoId: '1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      delivery: inMemoryDeliveriesRepository.items[0],
    })
    expect(result.value).toEqual({
      delivery: expect.objectContaining({
        status: DeliveryStatus.create(DeliveryStatusEnum.DELIVERED),
        deliveredAt: expect.any(Date),
      }),
    })
    expect(inMemoryDeliveriesRepository.items[0].confirmationPhoto).toEqual(
      expect.objectContaining({ confirmationPhotoId: new UniqueEntityID('1') }),
    )
  })

  it('should not be able to deliver without delivery has been withdrawn', async () => {
    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const delivery = makeDelivery()

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      deliveryId: delivery.id.toString(),
      confirmationPhotoId: '1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongStatusError)
  })

  it('should not be able to deliver without delivery', async () => {
    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      deliveryId: '1',
      confirmationPhotoId: '1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to deliver with other deliveryman', async () => {
    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const delivery = makeDelivery({
      status: DeliveryStatus.create(DeliveryStatusEnum.WITHDRAWN),
      withdrawnBy: deliveryman.id,
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliverymanId: '1',
      deliveryId: delivery.id.toString(),
      confirmationPhotoId: '1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
