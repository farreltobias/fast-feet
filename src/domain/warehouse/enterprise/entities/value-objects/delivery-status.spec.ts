import { DeliveryStatus, DeliveryStatusEnum } from './delivery-status'

describe('Delivery Status Value-Object', () => {
  it('should be able to validate Delivery Status', () => {
    const status = DeliveryStatus.create(DeliveryStatusEnum.CREATED)

    expect(status.isValid(DeliveryStatusEnum.PENDING)).toBe(true)
  })

  it('should not be able to validate false Delivery Status order', () => {
    const status = DeliveryStatus.create(DeliveryStatusEnum.PENDING)

    expect(status.isValid(DeliveryStatusEnum.DELIVERED)).toBe(false)
  })

  it('should not be able to validate return from DELIVERED', () => {
    const status = DeliveryStatus.create(DeliveryStatusEnum.DELIVERED)

    expect(status.isValid(DeliveryStatusEnum.WITHDRAWN)).toBe(false)
  })

  it('should not be able to validate return from RETURNED', () => {
    const status = DeliveryStatus.create(DeliveryStatusEnum.RETURNED)

    expect(status.isValid(DeliveryStatusEnum.DELIVERED)).toBe(false)
  })

  it('should be able to check if status is before', () => {
    const status = DeliveryStatus.create(DeliveryStatusEnum.PENDING)

    expect(status.isBefore(DeliveryStatusEnum.CREATED)).toBe(true)
  })

  it('should be able to check if status is next', () => {
    const status = DeliveryStatus.create(DeliveryStatusEnum.CREATED)

    expect(status.isNext(DeliveryStatusEnum.PENDING)).toBe(true)
  })
})
