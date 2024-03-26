import { PaginationParams } from '@/core/repositories/pagination-params'
import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveryWithLocation } from '../../enterprise/entities/value-objects/delivery-with-location'
import { DeliveryStatusEnum } from '../../enterprise/entities/value-objects/delivery-status'

export interface LocationParams extends PaginationParams {
  state: string
  city: string
  neighborhood?: string
  status?: DeliveryStatusEnum
}

export interface DeliverymanParams extends PaginationParams {
  deliverymanId: string
  status?: DeliveryStatusEnum
}

export interface DeliveriesRepository {
  findById(id: string): Promise<Delivery | null>
  save(delivery: Delivery): Promise<void>
  create(delivery: Delivery): Promise<void>
  findManyByLocation(params: LocationParams): Promise<DeliveryWithLocation[]>
  findManyByDeliveryman(
    params: DeliverymanParams,
  ): Promise<DeliveryWithLocation[]>
}
