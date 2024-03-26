import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { AuthenticateDeliverymanUseCase } from './authenticate-deliveryman'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { CPF } from '../../enterprise/entities/value-objects/cpf'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let sut: AuthenticateDeliverymanUseCase

describe('Authenticate Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateDeliverymanUseCase(
      inMemoryDeliverymansRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a deliveryman', async () => {
    const deliveryman = makeDeliveryman({
      cpf: CPF.create('52998224725'),
      password: await fakeHasher.hash('123456'),
    })

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const result = await sut.execute({
      cpf: '52998224725',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
