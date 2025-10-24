import { Optional } from '@nestjs/common';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  memberCount: number;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsNumber()
  gender: number;

  @IsNotEmpty()
  phones: string[];

  images: string[];

  @IsNumber()
  levelMemberMin: number;

  @IsNumber()
  levelMemberMax: number;

  @Optional()
  @IsNumber()
  priceMin: number;

  @Optional()
  @IsNumber()
  priceMax: number;

  @IsBoolean()
  @IsNotEmpty()
  agreement: boolean;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  location_id: string;
}
