export enum DeliveryStatusEnum {
  'CREATED',
  'PENDING',
  'WITHDRAWN',
  'DELIVERED',
  'RETURNED',
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
    const statusIndex = this.value
    const newStatusIndex = status

    return statusIndex - 1 === newStatusIndex
  }

  isNext(status: DeliveryStatusEnum) {
    const statusIndex = this.value
    const newStatusIndex = status

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
