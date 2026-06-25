import { MemberTier } from '@prisma/client';

export const TIER_LABELS: Record<MemberTier, { en: string; th: string }> = {
  DEAL_HUNTER: { en: 'Deal Hunter', th: 'นักล่าดีล' },
  DEAL_SCOUT: { en: 'Deal Scout', th: 'สายล่าดีล' },
  DEAL_MASTER: { en: 'Deal Master', th: 'ปรมาจารย์ดีล' },
  DEAL_LEGEND: { en: 'Deal Legend', th: 'ตำนานดีล' },
};

export const SCORE_REWARDS = {
  CREATE_POST: 15,
  CREATE_COMMENT: 5,
  POST_UPVOTED: 10,
  REVIEW_WITH_BODY: 20,
} as const;

export const TIER_THRESHOLDS: {
  tier: MemberTier;
  minScore: number;
  minPosts: number;
}[] = [
  { tier: 'DEAL_LEGEND', minScore: 2000, minPosts: 50 },
  { tier: 'DEAL_MASTER', minScore: 2000, minPosts: 30 },
  { tier: 'DEAL_SCOUT', minScore: 500, minPosts: 10 },
  { tier: 'DEAL_HUNTER', minScore: 0, minPosts: 0 },
];

export function resolveTier(dealScore: number, postCount: number): MemberTier {
  for (const rule of TIER_THRESHOLDS) {
    if (dealScore >= rule.minScore && postCount >= rule.minPosts) {
      return rule.tier;
    }
  }
  return 'DEAL_HUNTER';
}

export const VALID_PRESET_AVATARS = new Set([
  'preset:deal-hunter',
  'preset:scout',
  'preset:master',
  'preset:legend',
  'preset:beauty',
  'preset:tech',
  'preset:food',
  'preset:pets',
  'preset:gamer',
  'preset:home',
  'preset:fit',
  'preset:star',
]);
export async function generateUniqueUsername(
  prisma: { user: { findUnique: (args: { where: { username: string } }) => Promise<unknown | null> } },
  base: string,
): Promise<string> {
  const slug = base
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 24) || 'member';

  let candidate = slug;
  let suffix = 0;
  while (await prisma.user.findUnique({ where: { username: candidate } })) {
    suffix += 1;
    candidate = `${slug}_${suffix}`;
  }
  return candidate;
}
