import { Module } from '@nestjs/common';
import { AiReviewsService } from './application/ai-reviews.service';
import { AiReviewsController } from './presentation/ai-reviews.controller';

@Module({
  controllers: [AiReviewsController],
  providers: [AiReviewsService],
})
export class AiReviewsModule {}
