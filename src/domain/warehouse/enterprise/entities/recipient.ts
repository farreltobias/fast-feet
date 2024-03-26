import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface RecipientProps {
  name: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export class Recipient extends Entity<RecipientProps> {
  get name(): string {
    return this.props.name
  }

  get street(): string {
    return this.props.street
  }

  get number(): string {
    return this.props.number
  }

  get complement(): string | undefined {
    return this.props.complement
  }

  get neighborhood(): string {
    return this.props.neighborhood
  }

  get city(): string {
    return this.props.city
  }

  get state(): string {
    return this.props.state
  }

  get zipCode(): string {
    return this.props.zipCode
  }

  static create(props: RecipientProps, id?: UniqueEntityID): Recipient {
    return new Recipient(props, id)
  }
}
