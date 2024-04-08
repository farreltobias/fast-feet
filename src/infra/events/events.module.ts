import { OnDeliveryStatusChanged } from '@/domain/notification/application/subscribers/on-delivery-status-changed'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [OnDeliveryStatusChanged, SendNotificationUseCase],
})
export class EventsModule {}
