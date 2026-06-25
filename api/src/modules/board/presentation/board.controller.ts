import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BoardService } from '../application/board.service';
import { Public } from '../../../common/decorators/public.decorator';
import { OptionalAuth } from '../../../common/decorators/optional-auth.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import {
  CreateBoardCommentDto,
  CreateBoardPostDto,
} from './dto/board.dto';

@ApiTags('Board')
@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Public()
  @Get('groups')
  @ApiOperation({ summary: 'รายการกลุ่มบอร์ด' })
  getGroups() {
    return this.boardService.getGroups();
  }

  @Public()
  @Get('stats')
  @ApiOperation({ summary: 'สถิติชุมชนบอร์ด' })
  getStats() {
    return this.boardService.getStats();
  }

  @Public()
  @OptionalAuth()
  @Get('posts')
  @ApiOperation({ summary: 'รายการโพสต์บอร์ด' })
  @ApiQuery({ name: 'group', required: false })
  @ApiQuery({ name: 'sort', required: false, enum: ['hot', 'new'] })
  @ApiQuery({ name: 'unanswered', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  listPosts(
    @Query('group') groupSlug?: string,
    @Query('sort') sort?: 'hot' | 'new',
    @Query('unanswered') unanswered?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @CurrentUser('id') userId?: string,
  ) {
    return this.boardService.listPosts({
      groupSlug,
      sort: sort ?? 'hot',
      unanswered: unanswered === 'true' || unanswered === '1',
      page,
      limit,
      userId,
    });
  }

  @Public()
  @OptionalAuth()
  @Get('posts/:id')
  @ApiOperation({ summary: 'รายละเอียดโพสต์' })
  getPost(@Param('id') id: string, @CurrentUser('id') userId?: string) {
    return this.boardService.getPost(id, userId);
  }

  @Post('posts')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'สร้างโพสต์ใหม่' })
  createPost(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateBoardPostDto,
  ) {
    return this.boardService.createPost(userId, dto);
  }

  @Post('posts/:id/comments')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'แสดงความคิดเห็น' })
  addComment(
    @CurrentUser('id') userId: string,
    @Param('id') postId: string,
    @Body() dto: CreateBoardCommentDto,
  ) {
    return this.boardService.addComment(userId, postId, dto.body);
  }

  @Post('posts/:id/upvote')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'โหวต / ยกเลิกโหวต' })
  toggleUpvote(
    @CurrentUser('id') userId: string,
    @Param('id') postId: string,
  ) {
    return this.boardService.toggleUpvote(userId, postId);
  }
}
