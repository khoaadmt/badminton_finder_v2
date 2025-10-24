import { IsNotEmpty, IsNumber } from 'class-validator';
import { ObjectId, Types } from 'mongoose';

export class CreateCourtDto {
  @IsNotEmpty()
  @IsNumber()
  courtNumber: number;

  @IsNotEmpty()
  locationId: Types.ObjectId;
}
