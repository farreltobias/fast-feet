import { HashComparer } from '@/domain/warehouse/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/warehouse/application/cryptography/hash-generator'
import { CPF } from '@/domain/warehouse/enterprise/entities/value-objects/cpf'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

describe('Change Deliveryman Password (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let deliverymanFactory: DeliverymanFactory
  let adminFactory: AdminFactory
  let jwt: JwtService
  let hashGenerator: HashGenerator
  let hashComparer: HashComparer

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    adminFactory = moduleRef.get(AdminFactory)
    jwt = moduleRef.get(JwtService)

    hashGenerator = moduleRef.get(HashGenerator)
    hashComparer = moduleRef.get(HashComparer)

    await app.init()
  })

  test('[PATCH] /deliveryman/:cpf/change-password', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      cpf: CPF.create('52998224725'),
      password: await hashGenerator.hash('123456'),
    })

    const deliverymanCPF = deliveryman.cpf.toString()

    const response = await request(app.getHttpServer())
      .patch(`/deliveryman/${deliverymanCPF}/change-password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: '1234567',
      })

    expect(response.statusCode).toBe(204)

    const deliverymanOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: deliverymanCPF,
        role: 'DELIVERYMAN',
      },
    })

    const deliverymanOnDatabasePassword = deliverymanOnDatabase?.password ?? ''
    const passwordMatch = await hashComparer.compare(
      '1234567',
      deliverymanOnDatabasePassword,
    )

    expect(deliverymanOnDatabasePassword).not.toBe(deliveryman.password)
    expect(passwordMatch).toBe(true)
  })
})
