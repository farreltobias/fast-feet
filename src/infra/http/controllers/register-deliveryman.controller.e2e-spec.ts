import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

describe('Register Deliveryman (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /deliverymans', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .post(`/deliverymans`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        cpf: '52998224725',
        password: '123456',
      })

    expect(response.statusCode).toBe(201)

    const deliveryOnDatabase = await prisma.user.findFirst({
      where: { name: 'John Doe', role: 'DELIVERYMAN' },
    })

    expect(deliveryOnDatabase).toBeTruthy()
  })
})
