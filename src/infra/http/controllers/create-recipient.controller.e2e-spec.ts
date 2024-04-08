import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Create Recipient (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /recipients', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .post(`/recipients`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        street: 'Main Street',
        number: '193',
        neighborhood: 'Downtown',
        city: 'New York',
        state: 'NY',
        zipCode: '10001-100',
      })

    expect(response.statusCode).toBe(201)

    const recipientOnDatabase = await prisma.recipient.findFirst({
      where: { name: 'John Doe' },
    })

    expect(recipientOnDatabase).toBeTruthy()
  })
})
