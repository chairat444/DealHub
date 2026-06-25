import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../../../common/guards/roles.guard';
import { CategoriesService } from '../application/categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'รายการหมวดหมู่ (แอดมิน)' })
  findAll() {
    return this.categoriesService.findAllForAdmin();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขหมวดหมู่' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }
}
