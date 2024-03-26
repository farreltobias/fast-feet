import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CPF } from './value-objects/cpf'

export interface DeliverymanProps {
  name: string
  cpf: CPF
  password: string
}

export class Deliveryman extends Entity<DeliverymanProps> {
  get name(): string {
    return this.props.name
  }

  get cpf(): CPF {
    return this.props.cpf
  }

  get password(): string {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  static create(props: DeliverymanProps, id?: UniqueEntityID): Deliveryman {
    return new Deliveryman(props, id)
  }
}
