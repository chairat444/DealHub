import { Module } from '@nestjs/common';
import { BoardService } from './application/board.service';
import { BoardController } from './presentation/board.controller';

@Module({
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
