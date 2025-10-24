import { IsNotEmpty, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBookingDto {
    @IsNotEmpty()
    userName: string;

    @IsNotEmpty()
    courtId: number;

    @IsNotEmpty()
    shiftId: number;

    @IsNotEmpty()
    locationId: string;

    @IsNotEmpty()
    date: string;

    price: Number;
}
