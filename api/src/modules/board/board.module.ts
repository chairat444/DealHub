import { Module } from '@nestjs/common';
import { BoardService } from './application/board.service';
import { BoardController } from './presentation/board.controller';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [MembersModule],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
