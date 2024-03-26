import { Admin } from '../../enterprise/entities/admin'

export interface AdminsRepository {
  // findByCPF(cpf: string): Promise<Admin | null>
  findById(id: string): Promise<Admin | null>
  // create(admin: Admin): Promise<void>
}
