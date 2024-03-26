import { AdminsRepository } from '@/domain/warehouse/application/repositories/admins-repository'
import { Admin } from '@/domain/warehouse/enterprise/entities/admin'

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  async findByCPF(cpf: string): Promise<Admin | null> {
    const admin = this.items.find((item) => item.cpf.equals(cpf))

    if (!admin) {
      return null
    }

    return admin
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = this.items.find((item) => item.id.toString() === id)

    if (!admin) {
      return null
    }

    return admin
  }

  async create(admin: Admin) {
    this.items.push(admin)
  }
}
