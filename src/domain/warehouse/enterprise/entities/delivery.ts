import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Slug } from './value-objects/slug'
import { Optional } from '@/core/types/optional'
import {
  DeliveryStatus,
  DeliveryStatusEnum,
} from './value-objects/delivery-status'
import { DeliveryConfirmationPhoto } from './delivery-confirmation-photo'
import { DeliveryStatusChangedEvent } from '../events/delivery-status-changed-event'

export interface DeliveryProps {
  name: string
  slug: Slug
  status: DeliveryStatus
  createdBy: UniqueEntityID
  postedTo?: UniqueEntityID | null
  postedAt?: Date | null
  withdrawnAt?: Date | null
  withdrawnBy?: UniqueEntityID | null
  deliveredAt?: Date | null
  confirmationPhoto?: DeliveryConfirmationPhoto | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Delivery extends AggregateRoot<DeliveryProps> {
  get name(): string {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name

    this.props.slug = Slug.createFromText(name)
    this.touch()
  }

  get slug(): Slug {
    return this.props.slug
  }

  get status(): DeliveryStatus {
    return this.props.status
  }

  get createdBy(): UniqueEntityID {
    return this.props.createdBy
  }

  set status(status: DeliveryStatus) {
    const { value } = status
    const isValidStatus = this.props.status.isValid(value)

    if (!isValidStatus) {
      return
    }

    const isStatusProceeding = this.props.status.isNext(value)
    const isStatusReturning = this.props.status.isBefore(value)

    if (
      value === DeliveryStatusEnum.PENDING &&
      isStatusProceeding &&
      !this.props.postedTo
    ) {
      return
    }

    if (value === DeliveryStatusEnum.PENDING && isStatusReturning) {
      this.props.withdrawnAt = null
      this.props.withdrawnBy = null
    }

    if (
      value === DeliveryStatusEnum.DELIVERED &&
      isStatusProceeding &&
      !this.props.confirmationPhoto
    ) {
      return
    }

    if (this.props.postedTo) {
      this.addDomainEvent(
        new DeliveryStatusChangedEvent(this, status, this.props.postedTo),
      )
    }

    this.props.status = status
    this.touch()
  }

  get postedAt(): Date | null | undefined {
    return this.props.postedAt
  }

  get postedTo(): UniqueEntityID | null | undefined {
    return this.props.postedTo
  }

  set postedTo(postedTo: UniqueEntityID | null) {
    this.props.postedTo = postedTo
    this.touch()

    if (postedTo) {
      this.props.postedAt = new Date()
      this.status = DeliveryStatus.create(DeliveryStatusEnum.PENDING)
    }
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get withdrawnAt(): Date | null | undefined {
    return this.props.withdrawnAt
  }

  get withdrawnBy(): UniqueEntityID | null | undefined {
    return this.props.withdrawnBy
  }

  set withdrawnBy(deliverymanId: UniqueEntityID | null) {
    this.props.withdrawnBy = deliverymanId
    this.touch()

    if (deliverymanId) {
      this.props.withdrawnAt = new Date()
      this.status = DeliveryStatus.create(DeliveryStatusEnum.WITHDRAWN)
    }
  }

  get deliveredAt(): Date | null | undefined {
    return this.props.deliveredAt
  }

  get confirmationPhoto(): DeliveryConfirmationPhoto | null | undefined {
    return this.props.confirmationPhoto
  }

  set confirmationPhoto(photo: DeliveryConfirmationPhoto | null) {
    this.props.confirmationPhoto = photo
    this.touch()

    if (photo) {
      this.props.deliveredAt = new Date()
      this.status = DeliveryStatus.create(DeliveryStatusEnum.DELIVERED)
    }
  }

  get updatedAt(): Date | undefined | null {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<DeliveryProps, 'slug' | 'status' | 'createdAt'>,
    id?: UniqueEntityID,
  ): Delivery {
    return new Delivery(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.name),
        status:
          props.status ?? DeliveryStatus.create(DeliveryStatusEnum.CREATED),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
