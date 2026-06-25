import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BannerPlacement } from '@prisma/client';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CreateBannerDto, UpdateBannerDto } from '../presentation/dto/banners.dto';

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  listActive(placement: BannerPlacement = BannerPlacement.HERO) {
    return this.prisma.banner.findMany({
      where: { placement, isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        linkUrl: true,
        altText: true,
        sortOrder: true,
      },
    });
  }

  listAll(placement?: BannerPlacement) {
    return this.prisma.banner.findMany({
      where: placement ? { placement } : undefined,
      orderBy: [{ placement: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  async create(dto: CreateBannerDto) {
    return this.prisma.banner.create({
      data: {
        placement: dto.placement ?? BannerPlacement.HERO,
        title: dto.title,
        imageUrl: dto.imageUrl,
        linkUrl: dto.linkUrl ?? '/search',
        altText: dto.altText,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateBannerDto) {
    await this.ensureExists(id);
    return this.prisma.banner.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const banner = await this.ensureExists(id);
    this.deleteUploadedImage(banner.imageUrl);
    return this.prisma.banner.delete({ where: { id } });
  }

  async uploadImage(id: string, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('กรุณาเลือกไฟล์');

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException('รองรับเฉพาะ JPG, PNG, WebP');
    }

    const banner = await this.ensureExists(id);
    const ext =
      file.mimetype === 'image/png'
        ? '.png'
        : file.mimetype === 'image/webp'
          ? '.webp'
          : '.jpg';
    const dir = join(process.cwd(), 'uploads', 'banners');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const filename = `${id}-${Date.now()}${ext}`;
    writeFileSync(join(dir, filename), file.buffer);
    this.deleteUploadedImage(banner.imageUrl);

    return this.prisma.banner.update({
      where: { id },
      data: { imageUrl: `/uploads/banners/${filename}` },
    });
  }

  private async ensureExists(id: string) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new NotFoundException('ไม่พบแบนเนอร์');
    return banner;
  }

  private deleteUploadedImage(imageUrl: string) {
    if (!imageUrl.startsWith('/uploads/')) return;
    const filePath = join(process.cwd(), imageUrl.replace(/^\//, ''));
    try {
      if (existsSync(filePath)) unlinkSync(filePath);
    } catch {
      // ignore
    }
  }
}
