import { Module } from '@nestjs/common';
import { MembersService } from './application/members.service';
import { ReputationService } from './application/reputation.service';
import { MembersController } from './presentation/members.controller';

@Module({
  controllers: [MembersController],
  providers: [MembersService, ReputationService],
  exports: [ReputationService],
})
export class MembersModule {}
