import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMemberProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(40)
  nickname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  expertiseTags?: string[];
}
