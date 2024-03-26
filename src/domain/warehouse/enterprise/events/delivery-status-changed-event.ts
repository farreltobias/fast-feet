import { DomainEvent } from '@/core/events/domain-event'
import { Delivery } from '../entities/delivery'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeliveryStatus } from '../entities/value-objects/delivery-status'

export class DeliveryStatusChangedEvent implements DomainEvent {
  public ocurredAt: Date
  public recipientId: UniqueEntityID
  public status: DeliveryStatus
  public delivery: Delivery

  constructor(
    delivery: Delivery,
    status: DeliveryStatus,
    recipientId: UniqueEntityID,
  ) {
    this.delivery = delivery
    this.recipientId = recipientId
    this.status = status
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.delivery.id
  }
}
