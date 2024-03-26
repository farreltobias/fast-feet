import { ValueObject } from '@/core/entities/value-object'
import { DeliveryStatus } from './delivery-status'
import { Slug } from './slug'

export interface DeliveryWithLocationProps {
  name: string
  slug: Slug
  status: DeliveryStatus
  neighborhood: string
  city: string
  state: string
  updatedAt?: Date | null
}

export class DeliveryWithLocation extends ValueObject<DeliveryWithLocationProps> {
  get neighborhood(): string {
    return this.props.neighborhood
  }

  get city(): string {
    return this.props.city
  }

  get state(): string {
    return this.props.state
  }

  get name(): string {
    return this.props.name
  }

  get status(): DeliveryStatus {
    return this.props.status
  }

  get slug(): Slug {
    return this.props.slug
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }

  static create(props: DeliveryWithLocationProps): DeliveryWithLocation {
    return new DeliveryWithLocation(props)
  }
}
