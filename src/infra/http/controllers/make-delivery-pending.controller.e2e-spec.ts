import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryFactory } from 'test/factories/make-delivery'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Make Delivery Pending (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let deliveryFactory: DeliveryFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory, DeliveryFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /deliveries/:deliveryId/mark-pending', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'ADMIN',
    })

    const recipient = await recipientFactory.makePrismaRecipient()

    const delivery = await deliveryFactory.makePrismaDelivery({
      createdBy: user.id,
    })
    const deliveryId = delivery.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/deliveries/${deliveryId}/mark-pending`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        postedTo: recipient.id.toString(),
      })

    expect(response.statusCode).toBe(200)

    const deliveryOnDatabase = await prisma.delivery.findUnique({
      where: { id: delivery.id.toString() },
    })

    expect(deliveryOnDatabase?.status).toEqual('PENDING')
    expect(deliveryOnDatabase?.postedAt).toBeTruthy()
  })
})
