import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiReviewsService } from '../application/ai-reviews.service';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('AI Reviews')
@Controller('ai-reviews')
export class AiReviewsController {
  constructor(private aiReviewsService: AiReviewsService) {}

  @Public()
  @Get(':productId')
  @ApiOperation({ summary: 'สรุปรีวิวด้วย AI' })
  getSummary(@Param('productId') productId: string) {
    return this.aiReviewsService.getSummary(productId);
  }
}
