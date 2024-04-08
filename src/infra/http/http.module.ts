import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { StorageModule } from '../storage/storage.module'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { AuthenticateUserUseCase } from '@/domain/warehouse/application/use-cases/authenticate-user'
import { ChangeDeliverymanPasswordUseCase } from '@/domain/warehouse/application/use-cases/change-deliveryman-password'
import { CreateDeliveryUseCase } from '@/domain/warehouse/application/use-cases/create-delivery'
import { CreateRecipientUseCase } from '@/domain/warehouse/application/use-cases/create-recipient'
import { DeliverDeliveryUseCase } from '@/domain/warehouse/application/use-cases/deliver-delivery'
import { FetchDeliveriesByDeliverymanUseCase } from '@/domain/warehouse/application/use-cases/fetch-deliveries-by-deliveryman'
import { FetchPendingDeliveriesNearbyUseCase } from '@/domain/warehouse/application/use-cases/fetch-pending-deliveries-nearby'
import { GetDeliveryBySlugUseCase } from '@/domain/warehouse/application/use-cases/get-delivery-by-slug'
import { MakeDeliveryPendingUseCase } from '@/domain/warehouse/application/use-cases/make-delivery-pending'
import { RegisterDeliverymanUseCase } from '@/domain/warehouse/application/use-cases/register-deliveryman'
import { ReturnDeliveryUseCase } from '@/domain/warehouse/application/use-cases/return-delivery'
import { UploadAndCreateConfirmationPhotoUseCase } from '@/domain/warehouse/application/use-cases/upload-and-create-confirmation-photo'
import { WithdrawDeliveryUseCase } from '@/domain/warehouse/application/use-cases/withdraw-delivery'
import { AuthenticateController } from './controllers/authenticate.controller'
import { ChangePasswordController } from './controllers/change-deliveryman-password.controller'
import { CreateDeliveryController } from './controllers/create-delivery.controller'
import { CreateRecipientController } from './controllers/create-recipient.controller'
import { DeliverDeliveryController } from './controllers/deliver-delivery.controller'
import { FetchDeliveriesByDeliverymanController } from './controllers/fetch-deliveries-by-deliveryman.controller'
import { FetchPendingDeliveriesNearbyController } from './controllers/fetch-pending-deliveries.controller'
import { GetDeliveryBySlugController } from './controllers/get-delivery-by-slug.controller'
import { MakeDeliveryPendingController } from './controllers/make-delivery-pending.controller'
import { RegisterDeliverymanController } from './controllers/register-deliveryman.controller'
import { ReturnDeliveryController } from './controllers/return-delivery.controller'
import { UploadConfirmationPhotoController } from './controllers/upload-confirmation-photo.controller'
import { WithdrawDeliveryController } from './controllers/withdraw-delivery.controller'
import { ReadNotificationController } from './controllers/read-notification.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    AuthenticateController,
    ChangePasswordController,
    CreateDeliveryController,
    CreateRecipientController,
    DeliverDeliveryController,
    FetchDeliveriesByDeliverymanController,
    FetchPendingDeliveriesNearbyController,
    GetDeliveryBySlugController,
    MakeDeliveryPendingController,
    RegisterDeliverymanController,
    ReturnDeliveryController,
    UploadConfirmationPhotoController,
    WithdrawDeliveryController,
    ReadNotificationController,
  ],
  providers: [
    AuthenticateUserUseCase,
    ChangeDeliverymanPasswordUseCase,
    CreateDeliveryUseCase,
    CreateRecipientUseCase,
    DeliverDeliveryUseCase,
    FetchDeliveriesByDeliverymanUseCase,
    FetchPendingDeliveriesNearbyUseCase,
    GetDeliveryBySlugUseCase,
    MakeDeliveryPendingUseCase,
    RegisterDeliverymanUseCase,
    ReturnDeliveryUseCase,
    UploadAndCreateConfirmationPhotoUseCase,
    WithdrawDeliveryUseCase,
    ReadNotificationUseCase,
  ],
})
export class HttpModule {}
