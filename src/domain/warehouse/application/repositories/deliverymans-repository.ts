import { Deliveryman } from '../../enterprise/entities/deliveryman'

export interface DeliverymansRepository {
  findByCPF(cpf: string): Promise<Deliveryman | null>
  findById(id: string): Promise<Deliveryman | null>
  create(deliveryman: Deliveryman): Promise<void>
  save(deliveryman: Deliveryman): Promise<void>
}
