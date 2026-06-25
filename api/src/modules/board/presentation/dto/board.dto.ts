import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBoardPostDto {
  @IsString()
  @IsNotEmpty()
  groupSlug: string;

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
}

export class CreateBoardCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  body: string;
}
