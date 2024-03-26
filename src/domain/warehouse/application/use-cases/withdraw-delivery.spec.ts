import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository'
import { WithdrawDeliveryUseCase } from './withdraw-delivery'
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
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

let inMemoryDeliveryConfirmationPhotosRepository: InMemoryDeliveryConfirmationPhotosRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let sut: WithdrawDeliveryUseCase

describe('Withdraw Delivery', () => {
  beforeEach(() => {
    inMemoryDeliveryConfirmationPhotosRepository =
      new InMemoryDeliveryConfirmationPhotosRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryDeliveryConfirmationPhotosRepository,
      inMemoryRecipientsRepository,
    )
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    sut = new WithdrawDeliveryUseCase(
      inMemoryDeliveriesRepository,
      inMemoryDeliverymansRepository,
    )
  })

  it('should be able to withdraw a delivery', async () => {
    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const delivery = makeDelivery({
      status: DeliveryStatus.create(DeliveryStatusEnum.PENDING),
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      deliveryId: delivery.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      delivery: inMemoryDeliveriesRepository.items[0],
    })
    expect(result.value).toEqual({
      delivery: expect.objectContaining({
        status: DeliveryStatus.create(DeliveryStatusEnum.WITHDRAWN),
        withdrawnAt: expect.any(Date),
      }),
    })
  })

  it('should not be able to withdraw without delivery pending', async () => {
    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const delivery = makeDelivery()

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      deliveryId: delivery.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongStatusError)
  })

  it('should not be able to withdraw without delivery', async () => {
    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      deliveryId: '1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to withdraw with invalid deliveryman', async () => {
    const delivery = makeDelivery({
      status: DeliveryStatus.create(DeliveryStatusEnum.PENDING),
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliverymanId: '1',
      deliveryId: delivery.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
