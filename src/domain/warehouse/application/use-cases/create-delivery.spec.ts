import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository'
import { CreateDeliveryUseCase } from './create-delivery'
import { InMemoryDeliveryConfirmationPhotosRepository } from 'test/repositories/in-memory-delivery-confirmation-photos-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryDeliveryConfirmationPhotosRepository: InMemoryDeliveryConfirmationPhotosRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let sut: CreateDeliveryUseCase

describe('Create Delivery', () => {
  beforeEach(() => {
    inMemoryDeliveryConfirmationPhotosRepository =
      new InMemoryDeliveryConfirmationPhotosRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryDeliveryConfirmationPhotosRepository,
      inMemoryRecipientsRepository,
    )
    sut = new CreateDeliveryUseCase(
      inMemoryDeliveriesRepository,
      inMemoryAdminsRepository,
    )
  })

  it('should be able to create a new delivery', async () => {
    const admin = makeAdmin()

    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      name: 'Package 01',
      adminId: admin.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      delivery: inMemoryDeliveriesRepository.items[0],
    })
  })

  it('should not be able to create a new without admin', async () => {
    const result = await sut.execute({
      name: 'Package 01',
      adminId: '1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
