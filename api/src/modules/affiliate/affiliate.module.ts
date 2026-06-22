import { Module } from '@nestjs/common';
import { AffiliateService } from './application/affiliate.service';
import { AffiliateController } from './presentation/affiliate.controller';

@Module({
  controllers: [AffiliateController],
  providers: [AffiliateService],
})
export class AffiliateModule {}
