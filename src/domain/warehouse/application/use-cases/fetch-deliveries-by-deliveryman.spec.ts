import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository'
import { FetchDeliveriesByDeliverymanUseCase } from './fetch-deliveries-by-deliveryman'
import { makeDelivery } from 'test/factories/make-delivery'
import {
  DeliveryStatus,
  DeliveryStatusEnum,
} from '../../enterprise/entities/value-objects/delivery-status'
import { InMemoryDeliveryConfirmationPhotosRepository } from 'test/repositories/in-memory-delivery-confirmation-photos-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryDeliveryConfirmationPhotosRepository: InMemoryDeliveryConfirmationPhotosRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let sut: FetchDeliveriesByDeliverymanUseCase

describe('Fetch Delivery Nearby', () => {
  beforeEach(() => {
    inMemoryDeliveryConfirmationPhotosRepository =
      new InMemoryDeliveryConfirmationPhotosRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryDeliveryConfirmationPhotosRepository,
      inMemoryRecipientsRepository,
    )
    sut = new FetchDeliveriesByDeliverymanUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to fetch withdrawn deliveries by deliveryman', async () => {
    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const recipient = makeRecipient({
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Jardim Tucuruvi',
    })

    inMemoryRecipientsRepository.items.push(recipient)

    for (let i = 1; i <= 3; i++) {
      inMemoryDeliveriesRepository.items.push(
        makeDelivery({
          status: DeliveryStatus.create(DeliveryStatusEnum.WITHDRAWN),
          withdrawnBy: deliveryman.id,
          postedTo: recipient.id,
        }),
      )
    }

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      status: DeliveryStatusEnum.WITHDRAWN,
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.deliveries).toHaveLength(3)
  })

  it('should be able to paginate deliveries by deliveryman', async () => {
    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const recipient = makeRecipient({
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Jardim Tucuruvi',
    })

    inMemoryRecipientsRepository.items.push(recipient)

    for (let i = 1; i <= 22; i++) {
      inMemoryDeliveriesRepository.items.push(
        makeDelivery({
          status: DeliveryStatus.create(DeliveryStatusEnum.WITHDRAWN),
          withdrawnBy: deliveryman.id,
          postedTo: recipient.id,
        }),
      )
    }

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      status: DeliveryStatusEnum.WITHDRAWN,
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.deliveries).toHaveLength(2)
  })

  it('should not be able to fetch non withdrawn deliveries', async () => {
    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const recipient = makeRecipient({
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Jardim Tucuruvi',
    })

    inMemoryRecipientsRepository.items.push(recipient)

    for (let i = 1; i <= 2; i++) {
      inMemoryDeliveriesRepository.items.push(
        makeDelivery({
          status: DeliveryStatus.create(DeliveryStatusEnum.WITHDRAWN),
          withdrawnBy: deliveryman.id,
          postedTo: recipient.id,
        }),
      )
    }

    inMemoryDeliveriesRepository.items.push(
      makeDelivery({
        status: DeliveryStatus.create(DeliveryStatusEnum.PENDING),
      }),
    )

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.deliveries).toHaveLength(2)
  })
})
