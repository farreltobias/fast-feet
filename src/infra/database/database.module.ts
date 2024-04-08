import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'

import { AdminsRepository } from '@/domain/warehouse/application/repositories/admins-repository'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { ConfirmationPhotosRepository } from '@/domain/warehouse/application/repositories/confirmation-photos-repository'
import { PrismaConfirmationPhotosRepository } from './prisma/repositories/prisma-confirmation-photos-repository'
import { DeliveriesRepository } from '@/domain/warehouse/application/repositories/deliveries-repository'
import { DeliveryConfirmationPhotosRepository } from '@/domain/warehouse/application/repositories/delivery-confirmation-photos-repository'
import { DeliverymansRepository } from '@/domain/warehouse/application/repositories/deliverymans-repository'
import { RecipientsRepository } from '@/domain/warehouse/application/repositories/recipients-repository'
import { PrismaDeliveriesRepository } from './prisma/repositories/prisma-deliveries-repository'
import { PrismaDeliveryConfirmationPhotosRepository } from './prisma/repositories/prisma-delivery-confirmation-photo-repository'
import { PrismaDeliverymansRepository } from './prisma/repositories/prisma-deliverymans-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'

import { CacheModule } from '../cache/cache.module'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
    {
      provide: ConfirmationPhotosRepository,
      useClass: PrismaConfirmationPhotosRepository,
    },
    {
      provide: DeliveriesRepository,
      useClass: PrismaDeliveriesRepository,
    },
    {
      provide: DeliveryConfirmationPhotosRepository,
      useClass: PrismaDeliveryConfirmationPhotosRepository,
    },
    {
      provide: DeliverymansRepository,
      useClass: PrismaDeliverymansRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    AdminsRepository,
    ConfirmationPhotosRepository,
    DeliveriesRepository,
    DeliveryConfirmationPhotosRepository,
    DeliverymansRepository,
    RecipientsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
