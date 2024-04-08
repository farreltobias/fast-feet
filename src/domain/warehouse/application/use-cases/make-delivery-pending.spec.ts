import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository'
import { MakeDeliveryPendingUseCase } from './make-delivery-pending'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
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
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryDeliveryConfirmationPhotosRepository: InMemoryDeliveryConfirmationPhotosRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: MakeDeliveryPendingUseCase

describe('Make Delivery Pending', () => {
  beforeEach(() => {
    inMemoryDeliveryConfirmationPhotosRepository =
      new InMemoryDeliveryConfirmationPhotosRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryDeliveryConfirmationPhotosRepository,
      inMemoryRecipientsRepository,
    )
    sut = new MakeDeliveryPendingUseCase(
      inMemoryDeliveriesRepository,
      inMemoryAdminsRepository,
      inMemoryRecipientsRepository,
    )
  })

  it('should be able to set delivery pending', async () => {
    const admin = makeAdmin()

    inMemoryAdminsRepository.items.push(admin)

    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const delivery = makeDelivery()

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliveryId: delivery.id.toString(),
      postedTo: recipient.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      delivery: inMemoryDeliveriesRepository.items[0],
    })
    expect(result.value).toEqual({
      delivery: expect.objectContaining({
        status: DeliveryStatus.create(DeliveryStatusEnum.PENDING),
        postedTo: recipient.id,
        postedAt: expect.any(Date),
      }),
    })
  })

  it('should be able to set delivery pending from withdraw', async () => {
    const admin = makeAdmin()

    inMemoryAdminsRepository.items.push(admin)

    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const delivery = makeDelivery({
      status: DeliveryStatus.create(DeliveryStatusEnum.WITHDRAWN),
      withdrawnAt: new Date(),
      withdrawnBy: makeDeliveryman().id,
      postedTo: recipient.id,
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliveryId: delivery.id.toString(),
      postedTo: recipient.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      delivery: inMemoryDeliveriesRepository.items[0],
    })
    expect(result.value).toEqual({
      delivery: expect.objectContaining({
        status: DeliveryStatus.create(DeliveryStatusEnum.PENDING),
        postedAt: expect.any(Date),
        withdrawnAt: null,
        withdrawnBy: null,
      }),
    })
  })

  it('should not be able to set delivery pending with delivery wrong status', async () => {
    const admin = makeAdmin()

    inMemoryAdminsRepository.items.push(admin)

    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const delivery = makeDelivery({
      status: DeliveryStatus.create(DeliveryStatusEnum.DELIVERED),
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliveryId: delivery.id.toString(),
      postedTo: recipient.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongStatusError)
  })

  it('should not be able to set delivery pending without delivery', async () => {
    const admin = makeAdmin()

    inMemoryAdminsRepository.items.push(admin)

    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      postedTo: recipient.id.toString(),
      deliveryId: '1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to set delivery pending with invalid admin', async () => {
    const delivery = makeDelivery()

    inMemoryDeliveriesRepository.items.push(delivery)

    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: '1',
      deliveryId: delivery.id.toString(),
      postedTo: recipient.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to set delivery pending with invalid recipient', async () => {
    const admin = makeAdmin()

    inMemoryAdminsRepository.items.push(admin)

    const delivery = makeDelivery()

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliveryId: delivery.id.toString(),
      postedTo: '1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
