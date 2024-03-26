import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { DeliveryStatusChangedEvent } from '@/domain/warehouse/enterprise/events/delivery-status-changed-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnDeliveryStatusChanged implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      DeliveryStatusChangedEvent.name,
    )
  }

  private async sendNewAnswerNotification({
    delivery,
    recipientId,
  }: DeliveryStatusChangedEvent) {
    await this.sendNotification.execute({
      recipientId: recipientId.toString(),
      title: `Sua entrega: ${delivery.name
        .substring(0, 40)
        .trimEnd()
        .concat('...')} recebeu uma atualização de status!`,
      content: `O status da sua entrega ${delivery.name}, esta agora em ${delivery.status.value}`,
    })
  }
}
