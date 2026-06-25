import { Module } from '@nestjs/common';
import { BannersService } from './application/banners.service';
import { AdminBannersController, BannersController } from './presentation/banners.controller';

@Module({
  controllers: [BannersController, AdminBannersController],
  providers: [BannersService],
  exports: [BannersService],
})
export class BannersModule {}
