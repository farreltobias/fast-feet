import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliveryFactory } from 'test/factories/make-delivery'
import { RecipientFactory } from 'test/factories/make-recipient'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { waitFor } from 'test/utils/wait-for'
import {
  DeliveryStatusEnum,
  DeliveryStatus,
} from '@/domain/warehouse/enterprise/entities/value-objects/delivery-status'
import { AdminFactory } from 'test/factories/make-admin'

describe('On Delivery Status Changed (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
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
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    jwt = moduleRef.get(JwtService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when delivery changes status', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const recipient = await recipientFactory.makePrismaRecipient()

    const user = await deliverymanFactory.makePrismaDeliveryman()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'DELIVERYMAN',
    })

    const delivery = await deliveryFactory.makePrismaDelivery({
      status: DeliveryStatus.create(DeliveryStatusEnum.PENDING),
      createdBy: admin.id,
      postedTo: recipient.id,
      postedAt: new Date(),
    })

    const deliveryId = delivery.id.toString()

    await request(app.getHttpServer())
      .patch(`/deliveries/${deliveryId}/withdraw`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: recipient.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
