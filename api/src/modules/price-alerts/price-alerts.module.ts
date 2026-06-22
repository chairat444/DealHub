import { Module } from '@nestjs/common';
import { PriceAlertsService } from './application/price-alerts.service';
import { PriceAlertsController } from './presentation/price-alerts.controller';

@Module({
  controllers: [PriceAlertsController],
  providers: [PriceAlertsService],
})
export class PriceAlertsModule {}
