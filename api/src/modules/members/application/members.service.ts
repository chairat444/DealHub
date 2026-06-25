import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TIER_LABELS, VALID_PRESET_AVATARS } from '../constants/member.constants';

const profileSelect = {
  id: true,
  email: true,
  name: true,
  username: true,
  nickname: true,
  bio: true,
  avatar: true,
  dealScore: true,
  tier: true,
  expertiseTags: true,
  role: true,
  createdAt: true,
} as const;

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: profileSelect,
    });
    if (!user) throw new NotFoundException('ไม่พบสมาชิก');
    return this.enrichProfile(user);
  }

  async getByUsername(username: string) {
    const user = await this.prisma.user.findFirst({
      where: { username, status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
        username: true,
        nickname: true,
        bio: true,
        avatar: true,
        dealScore: true,
        tier: true,
        expertiseTags: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('ไม่พบโปรไฟล์');

    const posts = await this.prisma.boardPost.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: { select: { id: true, name: true, username: true, nickname: true, avatar: true, dealScore: true, tier: true } },
        group: { select: { id: true, slug: true, name: true, icon: true, color: true, bg: true } },
        product: { select: { id: true, slug: true, name: true, imageUrl: true } },
      },
    });

    const enriched = await this.enrichProfile(user);
    return {
      ...enriched,
      recentPosts: posts.map((p) => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt,
        upvotes: p.upvoteCount,
        comments: p.commentCount,
        timeAgo: this.formatTimeAgo(p.createdAt),
        groupSlug: p.group.slug,
        groupName: p.group.name,
        groupIcon: p.group.icon,
        postType: p.postType,
      })),
    };
  }

  async updateMe(
    userId: string,
    data: {
      nickname?: string;
      bio?: string;
      avatar?: string;
      expertiseTags?: string[];
    },
  ) {
    if (data.avatar !== undefined) {
      const avatar = data.avatar?.trim() || null;
      if (avatar && !VALID_PRESET_AVATARS.has(avatar)) {
        throw new BadRequestException('อวาตาร์ไม่ถูกต้อง');
      }
      const current = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true },
      });
      if (avatar?.startsWith('preset:')) {
        this.deleteUploadedAvatar(current?.avatar);
      }
      data.avatar = avatar ?? undefined;
    }

    if (data.nickname) {
      const taken = await this.prisma.user.findFirst({
        where: { nickname: data.nickname, NOT: { id: userId } },
      });
      if (taken) throw new ConflictException('ชื่อเล่นนี้ถูกใช้แล้ว');
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        nickname: data.nickname?.trim(),
        bio: data.bio?.trim(),
        avatar: data.avatar?.trim(),
        expertiseTags: data.expertiseTags,
      },
      select: profileSelect,
    });

    return this.enrichProfile(user);
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('กรุณาเลือกไฟล์');

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException('รองรับเฉพาะ JPG, PNG, WebP');
    }

    const current = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });
    if (!current) throw new NotFoundException('ไม่พบสมาชิก');

    const ext =
      file.mimetype === 'image/png'
        ? '.png'
        : file.mimetype === 'image/webp'
          ? '.webp'
          : '.jpg';
    const dir = join(process.cwd(), 'uploads', 'avatars');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const filename = `${userId}-${Date.now()}${ext}`;
    writeFileSync(join(dir, filename), file.buffer);

    this.deleteUploadedAvatar(current.avatar);

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: `/uploads/avatars/${filename}` },
      select: profileSelect,
    });

    return this.enrichProfile(user);
  }

  async getLeaderboard(limit = 20) {
    const users = await this.prisma.user.findMany({
      where: { status: 'ACTIVE', username: { not: null } },
      orderBy: { dealScore: 'desc' },
      take: Math.min(limit, 50),
      select: {
        id: true,
        username: true,
        nickname: true,
        name: true,
        avatar: true,
        dealScore: true,
        tier: true,
        _count: { select: { boardPosts: true } },
      },
    });

    return users.map((u, index) => ({
      rank: index + 1,
      id: u.id,
      username: u.username,
      displayName: u.nickname || u.name,
      avatar: u.avatar,
      dealScore: u.dealScore,
      tier: u.tier,
      tierLabel: TIER_LABELS[u.tier].th,
      postCount: u._count.boardPosts,
    }));
  }

  private async enrichProfile(
    user: {
      id: string;
      name: string;
      username: string | null;
      nickname: string | null;
      bio: string | null;
      avatar: string | null;
      dealScore: number;
      tier: import('@prisma/client').MemberTier;
      expertiseTags: unknown;
      role: string;
      createdAt: Date;
      email?: string;
    },
  ) {
    const [postCount, upvoteSum] = await Promise.all([
      this.prisma.boardPost.count({ where: { userId: user.id } }),
      this.prisma.boardPost.aggregate({
        where: { userId: user.id },
        _sum: { upvoteCount: true },
      }),
    ]);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      nickname: user.nickname,
      displayName: user.nickname || user.name,
      bio: user.bio,
      avatar: user.avatar,
      dealScore: user.dealScore,
      tier: user.tier,
      tierLabel: TIER_LABELS[user.tier].th,
      tierLabelEn: TIER_LABELS[user.tier].en,
      expertiseTags: (user.expertiseTags as string[] | null) ?? [],
      role: user.role,
      memberSince: user.createdAt,
      stats: {
        postCount,
        totalUpvotes: upvoteSum._sum.upvoteCount ?? 0,
      },
    };
  }

  private deleteUploadedAvatar(avatar: string | null | undefined) {
    if (!avatar?.startsWith('/uploads/')) return;
    const filePath = join(process.cwd(), avatar.replace(/^\//, ''));
    try {
      if (existsSync(filePath)) unlinkSync(filePath);
    } catch {
      // ignore missing files
    }
  }

  private formatTimeAgo(date: Date) {
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 60) return `${mins} นาที`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ชม.`;
    return `${Math.floor(hours / 24)} วัน`;
  }
}
