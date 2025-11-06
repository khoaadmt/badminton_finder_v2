import { IsNotEmpty, IsNumber } from 'class-validator';
export class CreateBookingDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    courtId: number;

    @IsNotEmpty()
    shiftId: number;

    @IsNotEmpty()
    locationId: number;

    @IsNotEmpty()
    date: string;

    price: Number;
}
