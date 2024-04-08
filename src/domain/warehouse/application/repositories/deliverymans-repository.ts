import { Deliveryman } from '../../enterprise/entities/deliveryman'

export abstract class DeliverymansRepository {
  abstract findByCPF(cpf: string): Promise<Deliveryman | null>
  abstract findById(id: string): Promise<Deliveryman | null>
  abstract create(deliveryman: Deliveryman): Promise<void>
  abstract save(deliveryman: Deliveryman): Promise<void>
}
