import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

const AVATAR_COLORS = [
  '#EE4D2D',
  '#26aa99',
  '#7B1FA2',
  '#F57C00',
  '#5C6BC0',
  '#AB47BC',
  '#43A047',
  '#7CB342',
  '#FF7043',
  '#E91E63',
];

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async getGroups() {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const groups = await this.prisma.boardGroup.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { posts: true } },
        posts: {
          where: { createdAt: { gte: since } },
          select: { id: true },
        },
      },
    });

    return groups.map((g) => ({
      id: g.id,
      slug: g.slug,
      name: g.name,
      icon: g.icon,
      description: g.description,
      color: g.color,
      bg: g.bg,
      sortOrder: g.sortOrder,
      postCount: g._count.posts,
      activeToday: g.posts.length,
    }));
  }

  async getStats() {
    const sinceDay = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [memberCount, postCount, postsToday, commentsToday, latestPost] =
      await Promise.all([
        this.prisma.user.count({ where: { status: 'ACTIVE' } }),
        this.prisma.boardPost.count(),
        this.prisma.boardPost.count({ where: { createdAt: { gte: sinceDay } } }),
        this.prisma.boardComment.count({
          where: { createdAt: { gte: sinceDay } },
        }),
        this.prisma.boardPost.findFirst({
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true },
        }),
      ]);

    const activeToday = await this.prisma.boardPost.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: sinceDay } },
    });

    return {
      memberCount,
      postCount,
      postsToday,
      commentsToday,
      activeToday: activeToday.length,
      latestPostAt: latestPost?.createdAt ?? null,
    };
  }

  async listPosts(params: {
    groupSlug?: string;
    limit?: number;
    page?: number;
    sort?: 'hot' | 'new';
    unanswered?: boolean;
    userId?: string;
  }) {
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 50);
    const page = Math.max(params.page ?? 1, 1);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (params.groupSlug) {
      const group = await this.prisma.boardGroup.findUnique({
        where: { slug: params.groupSlug },
      });
      if (!group) throw new NotFoundException('ไม่พบกลุ่มบอร์ด');
      where.groupId = group.id;
    }
    if (params.unanswered) {
      where.commentCount = 0;
    }

    const orderBy =
      params.sort === 'hot'
        ? [{ isHot: 'desc' as const }, { upvoteCount: 'desc' as const }, { createdAt: 'desc' as const }]
        : [{ createdAt: 'desc' as const }];

    const [posts, total] = await Promise.all([
      this.prisma.boardPost.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: this.postInclude(),
      }),
      this.prisma.boardPost.count({ where }),
    ]);

    const upvotedIds = params.userId
      ? await this.getUserUpvotedPostIds(
          params.userId,
          posts.map((p) => p.id),
        )
      : new Set<string>();

    return {
      items: posts.map((p) => this.mapPost(p, upvotedIds.has(p.id))),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPost(id: string, userId?: string) {
    const post = await this.prisma.boardPost.findUnique({
      where: { id },
      include: {
        ...this.postInclude(),
        comments: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { id: true, name: true } } },
        },
      },
    });
    if (!post) throw new NotFoundException('ไม่พบโพสต์');

    const hasUpvoted = userId
      ? !!(await this.prisma.boardPostUpvote.findUnique({
          where: { postId_userId: { postId: id, userId } },
        }))
      : false;

    return {
      ...this.mapPost(post, hasUpvoted),
      body: post.body,
      comments: post.comments.map((c) => ({
        id: c.id,
        body: c.body,
        createdAt: c.createdAt,
        timeAgo: this.formatTimeAgo(c.createdAt),
        user: this.mapUser(c.user),
      })),
    };
  }

  async createPost(
    userId: string,
    data: {
      groupSlug: string;
      title: string;
      excerpt?: string;
      body?: string;
      productId?: string;
    },
  ) {
    const group = await this.prisma.boardGroup.findUnique({
      where: { slug: data.groupSlug },
    });
    if (!group) throw new BadRequestException('ไม่พบกลุ่มบอร์ด');

    if (data.productId) {
      const product = await this.prisma.product.findUnique({
        where: { id: data.productId },
      });
      if (!product) throw new BadRequestException('ไม่พบสินค้า');
    }

    const post = await this.prisma.boardPost.create({
      data: {
        groupId: group.id,
        userId,
        title: data.title.trim(),
        excerpt: data.excerpt?.trim(),
        body: data.body?.trim(),
        productId: data.productId,
      },
      include: this.postInclude(),
    });

    return this.mapPost(post, false);
  }

  async addComment(userId: string, postId: string, body: string) {
    const post = await this.prisma.boardPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('ไม่พบโพสต์');

    const trimmed = body.trim();
    if (!trimmed) throw new BadRequestException('กรุณาใส่ข้อความ');

    const [comment] = await this.prisma.$transaction([
      this.prisma.boardComment.create({
        data: { postId, userId, body: trimmed },
        include: { user: { select: { id: true, name: true } } },
      }),
      this.prisma.boardPost.update({
        where: { id: postId },
        data: { commentCount: { increment: 1 } },
      }),
    ]);

    return {
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt,
      timeAgo: this.formatTimeAgo(comment.createdAt),
      user: this.mapUser(comment.user),
    };
  }

  async toggleUpvote(userId: string, postId: string) {
    const post = await this.prisma.boardPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('ไม่พบโพสต์');

    const existing = await this.prisma.boardPostUpvote.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existing) {
      await this.prisma.$transaction([
        this.prisma.boardPostUpvote.delete({ where: { id: existing.id } }),
        this.prisma.boardPost.update({
          where: { id: postId },
          data: {
            upvoteCount: { decrement: 1 },
            isHot: post.upvoteCount - 1 >= 150,
          },
        }),
      ]);
      return { upvoted: false, upvoteCount: post.upvoteCount - 1 };
    }

    const newCount = post.upvoteCount + 1;
    await this.prisma.$transaction([
      this.prisma.boardPostUpvote.create({ data: { postId, userId } }),
      this.prisma.boardPost.update({
        where: { id: postId },
        data: { upvoteCount: { increment: 1 }, isHot: newCount >= 150 },
      }),
    ]);
    return { upvoted: true, upvoteCount: newCount };
  }

  private postInclude() {
    return {
      user: { select: { id: true, name: true } },
      group: {
        select: { id: true, slug: true, name: true, icon: true, color: true, bg: true },
      },
      product: { select: { id: true, slug: true, name: true, imageUrl: true } },
    };
  }

  private async getUserUpvotedPostIds(userId: string, postIds: string[]) {
    if (!postIds.length) return new Set<string>();
    const rows = await this.prisma.boardPostUpvote.findMany({
      where: { userId, postId: { in: postIds } },
      select: { postId: true },
    });
    return new Set(rows.map((r) => r.postId));
  }

  private mapPost(
    post: {
      id: string;
      title: string;
      excerpt: string | null;
      upvoteCount: number;
      commentCount: number;
      isHot: boolean;
      createdAt: Date;
      user: { id: string; name: string };
      group: {
        id: string;
        slug: string;
        name: string;
        icon: string;
        color: string;
        bg: string;
      };
      product?: {
        id: string;
        slug: string;
        name: string;
        imageUrl: string | null;
      } | null;
    },
    hasUpvoted: boolean,
  ) {
    const user = this.mapUser(post.user);
    return {
      id: post.id,
      groupId: post.group.slug,
      groupSlug: post.group.slug,
      groupName: post.group.name,
      groupIcon: post.group.icon,
      groupColor: post.group.color,
      groupBg: post.group.bg,
      username: user.username,
      initials: user.initials,
      avatarColor: user.avatarColor,
      title: post.title,
      excerpt: post.excerpt,
      upvotes: post.upvoteCount,
      comments: post.commentCount,
      isHot: post.isHot,
      createdAt: post.createdAt,
      timeAgo: this.formatTimeAgo(post.createdAt),
      hasUpvoted,
      product: post.product
        ? {
            id: post.product.id,
            slug: post.product.slug,
            name: post.product.name,
            imageUrl: post.product.imageUrl,
          }
        : null,
    };
  }

  private mapUser(user: { id: string; name: string }) {
    return {
      id: user.id,
      name: user.name,
      username: `@${user.name.replace(/\s+/g, '_').toLowerCase()}`,
      initials: this.getInitials(user.name),
      avatarColor: this.getAvatarColor(user.id),
    };
  }

  private getInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  private getAvatarColor(userId: string) {
    let hash = 0;
    for (const ch of userId) hash = (hash + ch.charCodeAt(0)) % AVATAR_COLORS.length;
    return AVATAR_COLORS[hash]!;
  }

  formatTimeAgo(date: Date) {
    const diffMs = Date.now() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'เมื่อสักครู่';
    if (mins < 60) return `${mins} นาที`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ชม.`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} วัน`;
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  }
}
