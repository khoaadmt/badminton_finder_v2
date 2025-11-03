import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Timeline } from '../entities/location.entity';

export class CreateLocationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    contactPhone: string;

    @IsNotEmpty()
    img: string[];

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    numberOfCourts: number;

    @IsNumber()
    @IsNotEmpty()
    priceMin: number;

    @IsNumber()
    @IsNotEmpty()
    priceMax: number;

    @IsNotEmpty()
    openHours: Timeline;

    @IsNotEmpty()
    @IsNumber()
    latitude: number;

    @IsNotEmpty()
    @IsNumber()
    longitude: number;
}
