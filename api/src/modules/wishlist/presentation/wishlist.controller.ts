import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from '../application/wishlist.service';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('Wishlist')
@ApiBearerAuth()
@Controller('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'รายการสินค้าที่บันทึก' })
  getWishlist(@CurrentUser('id') userId: string) {
    return this.wishlistService.getUserWishlist(userId);
  }

  @Post()
  @ApiOperation({ summary: 'เพิ่มสินค้าในรายการโปรด' })
  add(@CurrentUser('id') userId: string, @Body('productId') productId: string) {
    return this.wishlistService.add(userId, productId);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'ลบสินค้าจากรายการโปรด' })
  remove(@CurrentUser('id') userId: string, @Param('productId') productId: string) {
    return this.wishlistService.remove(userId, productId);
  }
}
