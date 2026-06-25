import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MembersService } from '../application/members.service';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { UpdateMemberProfileDto } from './dto/members.dto';

@ApiTags('Members')
@Controller('members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'โปรไฟล์ของฉัน' })
  getMe(@CurrentUser('id') userId: string) {
    return this.membersService.getMe(userId);
  }

  @Put('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'แก้ไขโปรไฟล์' })
  updateMe(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateMemberProfileDto,
  ) {
    return this.membersService.updateMe(userId, dto);
  }

  @Post('me/avatar')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'อัปโหลดรูปโปรไฟล์' })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
          cb(new BadRequestException('รองรับเฉพาะ JPG, PNG, WebP'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  uploadAvatar(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.membersService.uploadAvatar(userId, file);
  }

  @Public()
  @Get('leaderboard')
  @ApiOperation({ summary: 'Leaderboard สมาชิก' })
  leaderboard(@Query('limit') limit?: number) {
    return this.membersService.getLeaderboard(limit);
  }

  @Public()
  @Get(':username')
  @ApiOperation({ summary: 'โปรไฟล์สาธารณะ' })
  getProfile(@Param('username') username: string) {
    return this.membersService.getByUsername(username);
  }
}
