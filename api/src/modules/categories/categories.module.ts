import { Module } from '@nestjs/common';
import { CategoriesService } from './application/categories.service';
import { CategoriesController } from './presentation/categories.controller';
import { AdminCategoriesController } from './presentation/admin-categories.controller';

@Module({
  controllers: [CategoriesController, AdminCategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
