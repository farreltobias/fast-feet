import { PaginationParams } from '@/core/repositories/pagination-params'
import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveryDetails } from '../../enterprise/entities/value-objects/delivery-details'
import { DeliveryStatusEnum } from '../../enterprise/entities/value-objects/delivery-status'
import { DeliveryWithRecipient } from '../../enterprise/entities/value-objects/delivery-with-recipient'

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

export abstract class DeliveriesRepository {
  abstract findById(id: string): Promise<Delivery | null>
  abstract save(delivery: Delivery): Promise<void>
  abstract create(delivery: Delivery): Promise<void>
  abstract findBySlug(slug: string): Promise<DeliveryWithRecipient | null>
  abstract findManyByLocation(
    params: LocationParams,
  ): Promise<DeliveryDetails[]>

  abstract findManyByDeliveryman(
    params: DeliverymanParams,
  ): Promise<DeliveryDetails[]>
}
