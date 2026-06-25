import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('DealHub TH API')
    .setDescription('แพลตฟอร์มเทียบราคาสินค้าจาก Shopee, Lazada, TikTok Shop')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'ระบบยืนยันตัวตน')
    .addTag('Products', 'สินค้า')
    .addTag('Categories', 'หมวดหมู่')
    .addTag('Wishlist', 'รายการที่ถูกใจ')
    .addTag('Price Alerts', 'แจ้งเตือนราคา')
    .addTag('Affiliate', 'Affiliate Tracking')
    .addTag('Admin', 'ผู้ดูแลระบบ')
    .addTag('AI Reviews', 'สรุปรีวิว AI')
    .addTag('Board', 'บอร์ดชุมชน')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 DealHub API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
