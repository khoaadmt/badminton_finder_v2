import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ObjectId, Types } from 'mongoose';
import { LocationEntity } from 'src/location/entities/location.entity';

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
    location: LocationEntity;
}
