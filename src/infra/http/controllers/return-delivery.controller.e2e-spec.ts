import {
  DeliveryStatus,
  DeliveryStatusEnum,
} from '@/domain/warehouse/enterprise/entities/value-objects/delivery-status'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryFactory } from 'test/factories/make-delivery'

describe('Return Delivery (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let deliveryFactory: DeliveryFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliveryFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /deliveries/:deliveryId/return', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'ADMIN',
    })

    const delivery = await deliveryFactory.makePrismaDelivery({
      status: DeliveryStatus.create(DeliveryStatusEnum.DELIVERED),
      createdBy: user.id,
    })
    const deliveryId = delivery.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/deliveries/${deliveryId}/return`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    const deliveryOnDatabase = await prisma.delivery.findUnique({
      where: { id: delivery.id.toString() },
    })

    expect(deliveryOnDatabase?.status).toEqual('RETURNED')
  })
})
