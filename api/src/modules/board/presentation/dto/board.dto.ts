import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { BoardPostType } from '@prisma/client';

export class CreateBoardPostDto {
  @IsString()
  @IsNotEmpty()
  groupSlug: string;

  @IsOptional()
  @IsEnum(BoardPostType)
  postType?: BoardPostType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  body?: string;

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  dealPrice?: number;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  affiliateUrl?: string;
}

export class UpdateBoardPostDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  body?: string;
}

export class CreateBoardCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  body: string;
}
