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
import { ConfirmationPhotoFactory } from 'test/factories/make-confirmation-photo'
import { DeliveryFactory } from 'test/factories/make-delivery'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

describe('Deliver Delivery (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let deliverymanFactory: DeliverymanFactory
  let deliveryFactory: DeliveryFactory
  let confirmationPhotoFactory: ConfirmationPhotoFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdminFactory,
        DeliverymanFactory,
        DeliveryFactory,
        ConfirmationPhotoFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    confirmationPhotoFactory = moduleRef.get(ConfirmationPhotoFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /deliveries/:deliveryId/deliver', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const user = await deliverymanFactory.makePrismaDeliveryman()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'DELIVERYMAN',
    })

    const delivery = await deliveryFactory.makePrismaDelivery({
      status: DeliveryStatus.create(DeliveryStatusEnum.WITHDRAWN),
      createdBy: admin.id,
      withdrawnBy: user.id,
      withdrawnAt: new Date(),
    })
    const deliveryId = delivery.id.toString()

    const confirmationPhoto =
      await confirmationPhotoFactory.makePrismaConfirmationPhoto()

    const response = await request(app.getHttpServer())
      .patch(`/deliveries/${deliveryId}/deliver`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        confirmationPhotoId: confirmationPhoto.id.toString(),
      })

    expect(response.statusCode).toBe(200)

    const deliveryOnDatabase = await prisma.delivery.findUnique({
      where: { id: delivery.id.toString() },
    })

    expect(deliveryOnDatabase?.status).toEqual('DELIVERED')
    expect(deliveryOnDatabase?.deliveredAt).toBeTruthy()
  })
})
