import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { RegisterDeliverymanUseCase } from './register-deliveryman'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { InvalidCPFError } from './errors/invalid-cpf-error'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { DeliverymanAlreadyExistsError } from './errors/deliveryman-already-exists-error'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let fakeHasher: FakeHasher

let sut: RegisterDeliverymanUseCase

describe('Register Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterDeliverymanUseCase(
      inMemoryDeliverymansRepository,
      fakeHasher,
    )
  })

  it('should be able to register a new deliveryman', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '52998224725',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryman: inMemoryDeliverymansRepository.items[0],
    })
  })

  it('should hash deliveryman password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '52998224725',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymansRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })

  it('should format cpf upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '52998224725',
      password: '123456',
    })

    const cpf = CPF.create('52998224725')

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymansRepository.items[0].cpf).toEqual(cpf)
  })

  it('should not be able to register with invalid cpf', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '00000000000',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCPFError)
  })

  it('should not be able to register same', async () => {
    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const result = await sut.execute({
      cpf: deliveryman.cpf.toString(),
      name: 'John Doe',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DeliverymanAlreadyExistsError)
  })
})
