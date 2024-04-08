import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { GetDeliveryBySlugUseCase } from '@/domain/warehouse/application/use-cases/get-delivery-by-slug'
import { DeliveryWithRecipientPresenter } from '../presenters/delivery-with-recipient-presenter'

@Controller('/deliveries/:slug')
export class GetDeliveryBySlugController {
  constructor(private getDeliveryBySlug: GetDeliveryBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getDeliveryBySlug.execute({
      slug,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      delivery: DeliveryWithRecipientPresenter.toHTTP(result.value.delivery),
    }
  }
}
