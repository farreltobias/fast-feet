import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { ChangeDeliverymanPasswordUseCase } from './change-deliveryman-password'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let fakeHasher: FakeHasher

let sut: ChangeDeliverymanPasswordUseCase

describe('Register Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    fakeHasher = new FakeHasher()
    sut = new ChangeDeliverymanPasswordUseCase(
      inMemoryDeliverymansRepository,
      fakeHasher,
    )
  })

  it('should be able to register a new deliveryman', async () => {
    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const result = await sut.execute({
      cpf: deliveryman.cpf.toString(),
      newPassword: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryman: expect.objectContaining({
        password: await fakeHasher.hash('123456'),
      }),
    })
  })

  it('should not be able to change deliveryman not found', async () => {
    const result = await sut.execute({
      cpf: '00000000000',
      newPassword: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
