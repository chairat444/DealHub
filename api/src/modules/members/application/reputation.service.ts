import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { resolveTier, SCORE_REWARDS } from '../constants/member.constants';

@Injectable()
export class ReputationService {
  constructor(private prisma: PrismaService) {}

  async award(userId: string, points: number) {
    if (points === 0) return;

    await this.prisma.user.update({
      where: { id: userId },
      data: { dealScore: { increment: points } },
    });

    await this.recalculateTier(userId);
  }

  async onPostCreated(userId: string, hasLongBody: boolean) {
    let points = SCORE_REWARDS.CREATE_POST;
    if (hasLongBody) points += SCORE_REWARDS.REVIEW_WITH_BODY;
    await this.award(userId, points);
  }

  async onCommentCreated(userId: string) {
    await this.award(userId, SCORE_REWARDS.CREATE_COMMENT);
  }

  async onPostUpvoted(authorId: string, voterId: string) {
    if (authorId === voterId) return;
    await this.award(authorId, SCORE_REWARDS.POST_UPVOTED);
  }

  async onUpvoteRemoved(authorId: string, voterId: string) {
    if (authorId === voterId) return;
    await this.award(authorId, -SCORE_REWARDS.POST_UPVOTED);
  }

  async recalculateTier(userId: string) {
    const [user, postCount] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { dealScore: true, tier: true },
      }),
      this.prisma.boardPost.count({ where: { userId } }),
    ]);
    if (!user) return;

    const tier = resolveTier(user.dealScore, postCount);
    if (tier !== user.tier) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { tier },
      });
    }
  }
}
