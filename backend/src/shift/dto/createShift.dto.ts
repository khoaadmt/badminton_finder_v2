import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ObjectId, Types } from 'mongoose';

export class CreateShiftDto {
  @IsNotEmpty()
  @IsNumber()
  shiftNumber: number;

  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsNumber()
  endTime: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  period: string;

  @IsNotEmpty()
  locationId: Types.ObjectId;
}
