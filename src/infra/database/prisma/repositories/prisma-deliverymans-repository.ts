import { DeliverymansRepository } from '@/domain/warehouse/application/repositories/deliverymans-repository'
import { Deliveryman } from '@/domain/warehouse/enterprise/entities/deliveryman'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaDeliverymanMapper } from '../mappers/prisma-deliveryman-mapper'
import { CPF } from '@/domain/warehouse/enterprise/entities/value-objects/cpf'

@Injectable()
export class PrismaDeliverymansRepository implements DeliverymansRepository {
  constructor(private prisma: PrismaService) {}

  async findByCPF(cpf: string): Promise<Deliveryman | null> {
    const deliveryman = await this.prisma.user.findUnique({
      where: {
        role: 'DELIVERYMAN',
        cpf: CPF.create(cpf).toString(),
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async findById(id: string): Promise<Deliveryman | null> {
    const deliveryman = await this.prisma.user.findUnique({
      where: {
        role: 'DELIVERYMAN',
        id,
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async create(deliveryman: Deliveryman): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prisma.user.create({
      data,
    })
  }

  async save(deliveryman: Deliveryman): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prisma.user.update({
      where: {
        id: deliveryman.id.toString(),
      },
      data,
    })
  }
}
