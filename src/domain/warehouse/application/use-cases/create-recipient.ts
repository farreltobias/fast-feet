import { Either, right } from '@/core/either'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientsRepository } from '../repositories/recipients-repository'

interface CreateRecipientDTO {
  name: string
  city: string
  neighborhood: string
  street: string
  number: string
  complement?: string
  state: string
  zipCode: string
}

type CreateRecipientResponse = Either<null, { recipient: Recipient }>

export class CreateRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    name,
    city,
    neighborhood,
    street,
    number,
    complement,
    state,
    zipCode,
  }: CreateRecipientDTO): Promise<CreateRecipientResponse> {
    const recipient = Recipient.create({
      name,
      city,
      neighborhood,
      street,
      number,
      complement,
      state,
      zipCode,
    })

    this.recipientsRepository.create(recipient)

    return right({
      recipient,
    })
  }
}
