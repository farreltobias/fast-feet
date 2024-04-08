export enum DeliveryStatusEnum {
  'CREATED' = 'CREATED',
  'PENDING' = 'PENDING',
  'WITHDRAWN' = 'WITHDRAWN',
  'DELIVERED' = 'DELIVERED',
  'RETURNED' = 'RETURNED',
}

export class DeliveryStatus {
  public value: DeliveryStatusEnum

  private constructor(value: DeliveryStatusEnum) {
    this.value = value
  }

  static create(status: DeliveryStatusEnum) {
    return new DeliveryStatus(status)
  }

  isBefore(status: DeliveryStatusEnum) {
    const statusIndex = Object.keys(DeliveryStatusEnum).indexOf(this.value)
    const newStatusIndex = Object.keys(DeliveryStatusEnum).indexOf(status)

    return statusIndex - 1 === newStatusIndex
  }

  isNext(status: DeliveryStatusEnum) {
    const statusIndex = Object.keys(DeliveryStatusEnum).indexOf(this.value)
    const newStatusIndex = Object.keys(DeliveryStatusEnum).indexOf(status)

    return statusIndex + 1 === newStatusIndex
  }

  isValid(status: DeliveryStatusEnum) {
    return (
      this.isNext(status) ||
      (!['WITHDRAWN', 'DELIVERED'].includes(DeliveryStatusEnum[status]) &&
        this.isBefore(status))
    )
  }
}
