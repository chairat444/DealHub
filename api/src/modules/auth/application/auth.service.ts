import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { RegisterDto, LoginDto } from '../presentation/dto/auth.dto';
import { generateUniqueUsername } from '../../members/constants/member.constants';
import { TIER_LABELS } from '../../members/constants/member.constants';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('อีเมลนี้ถูกใช้งานแล้ว');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const username = await generateUniqueUsername(
      this.prisma,
      dto.name || dto.email.split('@')[0]!,
    );
    const user = await this.prisma.user.create({
      data: { email: dto.email, passwordHash, name: dto.name, username },
    });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');

    return this.generateTokens(user);
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwt.verify(token, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) throw new UnauthorizedException();
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('โทเค็นไม่ถูกต้อง');
    }
  }

  private async generateTokens(user: {
    id: string;
    email: string;
    name: string;
    role: string;
    username?: string | null;
    avatar?: string | null;
    dealScore?: number;
    tier?: string;
  }) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        username: user.username,
        avatar: user.avatar ?? null,
        dealScore: user.dealScore ?? 0,
        tier: user.tier ?? 'DEAL_HUNTER',
        tierLabel: user.tier
          ? TIER_LABELS[user.tier as keyof typeof TIER_LABELS]?.th
          : TIER_LABELS.DEAL_HUNTER.th,
      },
    };
  }
}
