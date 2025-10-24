import { IsNotEmpty, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBookingDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  courtId: string;

  @IsNotEmpty()
  shiftId: string;

  @IsNotEmpty()
  locationId: string;

  @IsNotEmpty()
  date: string;

  price: Number;
}
