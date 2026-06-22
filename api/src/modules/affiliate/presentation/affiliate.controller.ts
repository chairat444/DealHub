import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AffiliateService } from '../application/affiliate.service';
import { Public } from '../../../common/decorators/public.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Marketplace } from '@prisma/client';
import { Roles } from '../../../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('Affiliate')
@Controller('affiliate')
export class AffiliateController {
  constructor(private affiliateService: AffiliateService) {}

  @Public()
  @Post('click')
  @ApiOperation({ summary: 'บันทึกการคลิก affiliate' })
  trackClick(
    @Body() body: { productId: string; marketplace: Marketplace },
    @CurrentUser('id') userId?: string,
  ) {
    return this.affiliateService.trackClick({ ...body, userId });
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'สถิติ affiliate clicks' })
  getStats(@Query('productId') productId?: string) {
    return this.affiliateService.getStats(productId);
  }
}
