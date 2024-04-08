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
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

describe('Withdraw Delivery (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let deliverymanFactory: DeliverymanFactory
  let deliveryFactory: DeliveryFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliverymanFactory, DeliveryFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /deliveries/:deliveryId/withdraw', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const user = await deliverymanFactory.makePrismaDeliveryman()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'DELIVERYMAN',
    })

    const delivery = await deliveryFactory.makePrismaDelivery({
      status: DeliveryStatus.create(DeliveryStatusEnum.PENDING),
      createdBy: admin.id,
    })
    const deliveryId = delivery.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/deliveries/${deliveryId}/withdraw`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    const deliveryOnDatabase = await prisma.delivery.findUnique({
      where: { id: delivery.id.toString() },
    })

    expect(deliveryOnDatabase?.status).toEqual('WITHDRAWN')
    expect(deliveryOnDatabase?.withdrawnBy).toEqual(user.id.toString())
    expect(deliveryOnDatabase?.withdrawnAt).toEqual(expect.any(Date))
  })
})
