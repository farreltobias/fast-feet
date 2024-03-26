import { DeliverymansRepository } from '@/domain/warehouse/application/repositories/deliverymans-repository'
import { Deliveryman } from '@/domain/warehouse/enterprise/entities/deliveryman'

export class InMemoryDeliverymansRepository implements DeliverymansRepository {
  public items: Deliveryman[] = []

  async findByCPF(cpf: string): Promise<Deliveryman | null> {
    const deliveryman = this.items.find((item) => item.cpf.equals(cpf))

    if (!deliveryman) {
      return null
    }

    return deliveryman
  }

  async findById(id: string): Promise<Deliveryman | null> {
    const deliveryman = this.items.find((item) => item.id.toString() === id)

    if (!deliveryman) {
      return null
    }

    return deliveryman
  }

  async save(deliveryman: Deliveryman): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(deliveryman.id))

    this.items[index] = deliveryman
  }

  async create(deliveryman: Deliveryman) {
    this.items.push(deliveryman)
  }
}
