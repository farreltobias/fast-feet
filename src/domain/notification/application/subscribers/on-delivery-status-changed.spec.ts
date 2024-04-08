import { makeDelivery } from 'test/factories/make-delivery'
import { OnDeliveryStatusChanged } from './on-delivery-status-changed'
import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository'
import { InMemoryDeliveryConfirmationPhotosRepository } from 'test/repositories/in-memory-delivery-confirmation-photos-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

import {
  SendNotificationRequestUseCase,
  SendNotificationResponseUseCase,
  SendNotificationUseCase,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { MockInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'

import { makeRecipient } from 'test/factories/make-recipient'
import {
  DeliveryStatus,
  DeliveryStatusEnum,
} from '@/domain/warehouse/enterprise/entities/value-objects/delivery-status'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'

let inMemoryDeliveryConfirmationPhotosRepository: InMemoryDeliveryConfirmationPhotosRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationRequestUseCase],
  Promise<SendNotificationResponseUseCase>
>

describe('On Delivery Created', () => {
  beforeEach(() => {
    inMemoryDeliveryConfirmationPhotosRepository =
      new InMemoryDeliveryConfirmationPhotosRepository()

    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()

    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryDeliveryConfirmationPhotosRepository,
      inMemoryRecipientsRepository,
    )

    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnDeliveryStatusChanged(sendNotificationUseCase)
  })

  it('should send a notification when an delivery is created', async () => {
    const recipient = makeRecipient()

    const delivery = makeDelivery({
      status: DeliveryStatus.create(DeliveryStatusEnum.PENDING),
      postedTo: recipient.id,
    })

    const deliveryman = makeDeliveryman()

    await inMemoryRecipientsRepository.create(recipient)
    await inMemoryDeliveriesRepository.create(delivery)
    await inMemoryDeliverymansRepository.create(deliveryman)

    delivery.withdrawnBy = deliveryman.id
    await inMemoryDeliveriesRepository.save(delivery)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
