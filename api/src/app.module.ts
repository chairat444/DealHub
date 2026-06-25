import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { PriceAlertsModule } from './modules/price-alerts/price-alerts.module';
import { AffiliateModule } from './modules/affiliate/affiliate.module';
import { AdminModule } from './modules/admin/admin.module';
import { AiReviewsModule } from './modules/ai-reviews/ai-reviews.module';
import { BoardModule } from './modules/board/board.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    CacheModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    WishlistModule,
    PriceAlertsModule,
    AffiliateModule,
    AdminModule,
    AiReviewsModule,
    BoardModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
