import {
  DeliveryStatus,
  DeliveryStatusEnum,
} from '@/domain/warehouse/enterprise/entities/value-objects/delivery-status'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { ConfirmationPhotoFactory } from 'test/factories/make-confirmation-photo'
import { DeliveryFactory } from 'test/factories/make-delivery'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Fetch Deliveries by Deliveryman (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
  let deliveryFactory: DeliveryFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdminFactory,
        DeliverymanFactory,
        RecipientFactory,
        DeliveryFactory,
        ConfirmationPhotoFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /deliveries/pending-nearby', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const user = await deliverymanFactory.makePrismaDeliveryman()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'DELIVERYMAN',
    })

    const recipient = await recipientFactory.makePrismaRecipient({
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Vila Mariana',
    })

    await Promise.all([
      deliveryFactory.makePrismaDelivery({
        name: 'Delivery 1',
        status: DeliveryStatus.create(DeliveryStatusEnum.WITHDRAWN),
        createdBy: admin.id,
        createdAt: new Date(),
        withdrawnBy: user.id,
        withdrawnAt: new Date(),
        postedTo: recipient.id,
        postedAt: new Date(),
      }),
      deliveryFactory.makePrismaDelivery({
        name: 'Delivery 2',
        status: DeliveryStatus.create(DeliveryStatusEnum.PENDING),
        createdBy: admin.id,
        createdAt: new Date(),
        postedTo: recipient.id,
        postedAt: new Date(),
      }),
    ])

    const query = {
      page: '1',
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Vila Mariana',
    }

    const stringifiedQuery = new URLSearchParams(query).toString()

    const response = await request(app.getHttpServer())
      .get(`/deliveries/pending-nearby?${stringifiedQuery}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.deliveries).toHaveLength(1)
    expect(response.body).toEqual({
      deliveries: expect.arrayContaining([
        expect.objectContaining({
          name: 'Delivery 2',
          status: 'PENDING',
        }),
      ]),
    })
  })
})
