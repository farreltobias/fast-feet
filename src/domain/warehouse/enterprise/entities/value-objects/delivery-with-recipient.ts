import { ValueObject } from '@/core/entities/value-object'
import { DeliveryStatus } from './delivery-status'

export interface DeliveryWithRecipientProps {
  recipientName: string
  street: string
  number: string
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  zipCode: string
  status: DeliveryStatus
  postedAt?: Date | null
  withdrawnAt?: Date | null
  deliveredAt?: Date | null
}

export class DeliveryWithRecipient extends ValueObject<DeliveryWithRecipientProps> {
  get recipientName(): string {
    return this.props.recipientName
  }

  get street(): string {
    return this.props.street
  }

  get number(): string {
    return this.props.number
  }

  get complement(): string | null | undefined {
    return this.props.complement
  }

  get neighborhood(): string {
    return this.props.neighborhood
  }

  get city(): string {
    return this.props.city
  }

  get state(): string {
    return this.props.state
  }

  get zipCode(): string {
    return this.props.zipCode
  }

  get status(): DeliveryStatus {
    return this.props.status
  }

  get postedAt(): Date | null | undefined {
    return this.props.postedAt
  }

  get withdrawnAt(): Date | null | undefined {
    return this.props.withdrawnAt
  }

  get deliveredAt(): Date | null | undefined {
    return this.props.deliveredAt
  }

  static create(props: DeliveryWithRecipientProps): DeliveryWithRecipient {
    return new DeliveryWithRecipient(props)
  }
}
