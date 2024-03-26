import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository'
import { FetchPendingDeliveriesNearbyUseCase } from './fetch-pending-deliveries-nearby'
import { makeDelivery } from 'test/factories/make-delivery'
import {
  DeliveryStatus,
  DeliveryStatusEnum,
} from '../../enterprise/entities/value-objects/delivery-status'
import { InMemoryDeliveryConfirmationPhotosRepository } from 'test/repositories/in-memory-delivery-confirmation-photos-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryDeliveryConfirmationPhotosRepository: InMemoryDeliveryConfirmationPhotosRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: FetchPendingDeliveriesNearbyUseCase

describe('Fetch Delivery Nearby', () => {
  beforeEach(() => {
    inMemoryDeliveryConfirmationPhotosRepository =
      new InMemoryDeliveryConfirmationPhotosRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryDeliveryConfirmationPhotosRepository,
      inMemoryRecipientsRepository,
    )
    sut = new FetchPendingDeliveriesNearbyUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to fetch deliveries nearby a location', async () => {
    const recipient = makeRecipient({
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Jardim Tucuruvi',
    })

    inMemoryRecipientsRepository.items.push(recipient)

    inMemoryDeliveriesRepository.items.push(
      makeDelivery({
        status: DeliveryStatus.create(DeliveryStatusEnum.PENDING),
        recipientId: recipient.id,
      }),
    )

    inMemoryDeliveriesRepository.items.push(
      makeDelivery({
        status: DeliveryStatus.create(DeliveryStatusEnum.PENDING),
        recipientId: recipient.id,
      }),
    )

    inMemoryDeliveriesRepository.items.push(
      makeDelivery({
        status: DeliveryStatus.create(DeliveryStatusEnum.PENDING),
        recipientId: recipient.id,
      }),
    )

    const result = await sut.execute({
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Jardim Tucuruvi',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.deliveries).toHaveLength(3)
  })

  it('should be able to paginate deliveries nearby a location', async () => {
    const recipient = makeRecipient({
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Jardim Tucuruvi',
    })

    inMemoryRecipientsRepository.items.push(recipient)

    for (let i = 1; i <= 22; i++) {
      inMemoryDeliveriesRepository.items.push(
        makeDelivery({
          status: DeliveryStatus.create(DeliveryStatusEnum.PENDING),
          recipientId: recipient.id,
        }),
      )
    }

    const result = await sut.execute({
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Jardim Tucuruvi',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.deliveries).toHaveLength(2)
  })

  it('should not be able to fetch non pending deliveries nearby a location', async () => {
    const recipient = makeRecipient({
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Jardim Tucuruvi',
    })

    inMemoryRecipientsRepository.items.push(recipient)

    inMemoryDeliveriesRepository.items.push(
      makeDelivery({
        status: DeliveryStatus.create(DeliveryStatusEnum.PENDING),
        recipientId: recipient.id,
      }),
    )

    inMemoryDeliveriesRepository.items.push(
      makeDelivery({
        status: DeliveryStatus.create(DeliveryStatusEnum.PENDING),
        recipientId: recipient.id,
      }),
    )

    inMemoryDeliveriesRepository.items.push(
      makeDelivery({
        status: DeliveryStatus.create(DeliveryStatusEnum.WITHDRAWN),
        recipientId: recipient.id,
      }),
    )

    const result = await sut.execute({
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Jardim Tucuruvi',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.deliveries).toHaveLength(2)
  })
})
