import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BannerPlacement, UserRole } from '@prisma/client';
import { BannersService } from '../application/banners.service';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/guards/roles.guard';
import { CreateBannerDto, UpdateBannerDto } from './dto/banners.dto';

@ApiTags('Banners')
@Controller('banners')
export class BannersController {
  constructor(private bannersService: BannersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'โฆษณา/แบนเนอร์ที่เปิดใช้งานตามตำแหน่ง' })
  listActive(@Query('placement') placement?: BannerPlacement) {
    return this.bannersService.listActive(placement ?? BannerPlacement.HERO);
  }

  @Public()
  @Post(':id/impression')
  @ApiOperation({ summary: 'บันทึกการแสดงโฆษณา' })
  recordImpression(@Param('id') id: string) {
    return this.bannersService.recordImpression(id);
  }

  @Public()
  @Post(':id/click')
  @ApiOperation({ summary: 'บันทึกการคลิกโฆษณา' })
  recordClick(@Param('id') id: string) {
    return this.bannersService.recordClick(id);
  }
}

@ApiTags('Admin')
@ApiBearerAuth()
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/banners')
export class AdminBannersController {
  constructor(private bannersService: BannersService) {}

  @Get()
  @ApiOperation({ summary: 'รายการแบนเนอร์ทั้งหมด' })
  listAll(@Query('placement') placement?: BannerPlacement) {
    return this.bannersService.listAll(placement);
  }

  @Post()
  @ApiOperation({ summary: 'สร้างแบนเนอร์' })
  create(@Body() dto: CreateBannerDto) {
    return this.bannersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขแบนเนอร์' })
  update(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.bannersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบแบนเนอร์' })
  remove(@Param('id') id: string) {
    return this.bannersService.remove(id);
  }

  @Post(':id/image')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'อัปโหลดรูปแบนเนอร์' })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 3 * 1024 * 1024 },
    }),
  )
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.bannersService.uploadImage(id, file);
  }
}
