import { AdminsRepository } from '@/domain/warehouse/application/repositories/admins-repository'
import { Admin } from '@/domain/warehouse/enterprise/entities/admin'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper'
import { CPF } from '@/domain/warehouse/enterprise/entities/value-objects/cpf'

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private prisma: PrismaService) {}

  async findByCPF(cpf: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        role: 'ADMIN',
        cpf: CPF.create(cpf).toString(),
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        id,
        role: 'ADMIN',
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }
}
