import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PriceAlertsService } from '../application/price-alerts.service';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('Price Alerts')
@ApiBearerAuth()
@Controller('price-alerts')
export class PriceAlertsController {
  constructor(private priceAlertsService: PriceAlertsService) {}

  @Get()
  @ApiOperation({ summary: 'รายการแจ้งเตือนราคา' })
  getAlerts(@CurrentUser('id') userId: string) {
    return this.priceAlertsService.getUserAlerts(userId);
  }

  @Post()
  @ApiOperation({ summary: 'ตั้งแจ้งเตือนราคา' })
  create(
    @CurrentUser('id') userId: string,
    @Body() body: { productId: string; targetPrice: number },
  ) {
    return this.priceAlertsService.create(userId, body.productId, body.targetPrice);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ยกเลิกแจ้งเตือนราคา' })
  deactivate(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.priceAlertsService.deactivate(userId, id);
  }
}
