import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/warehouse/enterprise/entities/recipient'
import { Prisma, Recipient as PrismaRecipient } from '@prisma/client'

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        city: raw.city,
        neighborhood: raw.neighborhood,
        number: raw.number,
        state: raw.state,
        street: raw.street,
        zipCode: raw.zipCode,
        complement: raw.complement,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      city: recipient.city,
      neighborhood: recipient.neighborhood,
      number: recipient.number,
      state: recipient.state,
      street: recipient.street,
      zipCode: recipient.zipCode,
      complement: recipient.complement,
    }
  }
}
