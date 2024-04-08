import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { AuthenticateUserUseCase } from './authenticate-user'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let sut: AuthenticateUserUseCase

describe('Authenticate Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateUserUseCase(
      inMemoryDeliverymansRepository,
      inMemoryAdminsRepository,
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
