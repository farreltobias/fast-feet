import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository'
import { ReturnDeliveryUseCase } from './return-delivery'
import { makeDelivery } from 'test/factories/make-delivery'
import {
  DeliveryStatus,
  DeliveryStatusEnum,
} from '../../enterprise/entities/value-objects/delivery-status'
import { InMemoryDeliveryConfirmationPhotosRepository } from 'test/repositories/in-memory-delivery-confirmation-photos-repository'
import { WrongStatusError } from './errors/wrong-status-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

let inMemoryDeliveryConfirmationPhotosRepository: InMemoryDeliveryConfirmationPhotosRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: ReturnDeliveryUseCase

describe('Return Delivery', () => {
  beforeEach(() => {
    inMemoryDeliveryConfirmationPhotosRepository =
      new InMemoryDeliveryConfirmationPhotosRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryDeliveryConfirmationPhotosRepository,
      inMemoryRecipientsRepository,
    )
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new ReturnDeliveryUseCase(
      inMemoryDeliveriesRepository,
      inMemoryAdminsRepository,
    )
  })

  it('should be able to return delivery', async () => {
    const admin = makeAdmin()

    inMemoryAdminsRepository.items.push(admin)

    const delivery = makeDelivery({
      status: DeliveryStatus.create(DeliveryStatusEnum.DELIVERED),
      withdrawnBy: makeDeliveryman().id,
      withdrawnAt: new Date(),
      deliveredAt: new Date(),
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliveryId: delivery.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      delivery: inMemoryDeliveriesRepository.items[0],
    })
    expect(result.value).toEqual({
      delivery: expect.objectContaining({
        status: DeliveryStatus.create(DeliveryStatusEnum.RETURNED),
      }),
    })
  })

  it('should not be able to return delivery with wrong status', async () => {
    const admin = makeAdmin()

    inMemoryAdminsRepository.items.push(admin)

    const delivery = makeDelivery({
      status: DeliveryStatus.create(DeliveryStatusEnum.WITHDRAWN),
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliveryId: delivery.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongStatusError)
  })

  it('should not be able to return delivery without delivery', async () => {
    const admin = makeAdmin()

    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliveryId: '1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to set delivery pending with invalid admin', async () => {
    const delivery = makeDelivery({
      status: DeliveryStatus.create(DeliveryStatusEnum.DELIVERED),
      withdrawnBy: makeDeliveryman().id,
      withdrawnAt: new Date(),
      deliveredAt: new Date(),
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      adminId: '1',
      deliveryId: delivery.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
