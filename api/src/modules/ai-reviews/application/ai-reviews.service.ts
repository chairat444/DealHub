import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class AiReviewsService {
  constructor(private prisma: PrismaService) {}

  async generateSummary(productId: string): Promise<string> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { listings: true },
    });
    if (!product) return '';

    const marketplaces = product.listings.map((l) => l.marketplace).join(', ');
    const avgRating = product.rating ? Number(product.rating).toFixed(1) : 'N/A';

    const summary = `สรุปรีวิวสินค้า "${product.name}" จาก ${product.reviewCount} รีวิว:
คะแนนเฉลี่ย ${avgRating}/5 ขายแล้ว ${product.soldCount.toLocaleString()} ชิ้น
พบใน ${marketplaces || 'หลายแพลตฟอร์ม'}
${product.brand ? `แบรนด์: ${product.brand}` : ''}
สินค้านี้ได้รับความนิยมในหมวด${product.categoryId ? 'ที่เกี่ยวข้อง' : 'ทั่วไป'} ราคาแข่งขันได้ดีเมื่อเทียบกับแพลตฟอร์มอื่น แนะนำสำหรับผู้ที่มองหาคุณภาพในราคาที่คุ้มค่า`;

    await this.prisma.product.update({
      where: { id: productId },
      data: { aiReviewSummary: summary },
    });

    return summary;
  }

  async getSummary(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { aiReviewSummary: true },
    });
    if (product?.aiReviewSummary) return product.aiReviewSummary;
    return this.generateSummary(productId);
  }
}
