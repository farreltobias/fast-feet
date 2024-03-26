import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ConfirmationPhotoProps {
  title: string
  url: string
}

export class ConfirmationPhoto extends Entity<ConfirmationPhotoProps> {
  get title(): string {
    return this.props.title
  }

  get url(): string {
    return this.props.url
  }

  static create(
    props: ConfirmationPhotoProps,
    id?: UniqueEntityID,
  ): ConfirmationPhoto {
    return new ConfirmationPhoto(props, id)
  }
}
