import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from '../application/products.service';
import { Public } from '../../../common/decorators/public.decorator';
import { Marketplace } from '@prisma/client';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'ค้นหาสินค้า' })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'marketplace', required: false, enum: Marketplace })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'page', required: false })
  search(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('marketplace') marketplace?: Marketplace,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sort') sort?: 'price_asc' | 'price_desc' | 'sold' | 'rating' | 'newest',
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.productsService.search({ q, category, marketplace, minPrice, maxPrice, sort, page, limit });
  }

  @Public()
  @Get('trending')
  @ApiOperation({ summary: 'สินค้ามาแรง' })
  getTrending(@Query('limit') limit?: number) {
    return this.productsService.getTrending(limit);
  }

  @Public()
  @Get('top-selling')
  @ApiOperation({ summary: 'สินค้าขายดี' })
  getTopSelling(@Query('limit') limit?: number) {
    return this.productsService.getTopSelling(limit);
  }

  @Public()
  @Get('compare')
  @ApiOperation({ summary: 'เปรียบเทียบสินค้า' })
  compare(@Query('ids') ids: string) {
    const productIds = ids.split(',').filter(Boolean);
    return this.productsService.compare(productIds);
  }

  @Public()
  @Get('price-history/:id')
  @ApiOperation({ summary: 'ประวัติราคา' })
  getPriceHistory(@Param('id') id: string, @Query('days') days?: number) {
    return this.productsService.getPriceHistory(id, days);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'รายละเอียดสินค้า' })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }
}
