import { IsNotEmpty, IsNumber } from 'class-validator';
import { LocationEntity } from 'src/location/entities/location.entity';

export class CreateCourtDto {
    @IsNotEmpty()
    @IsNumber()
    courtNumber: number;

    @IsNotEmpty()
    location: LocationEntity;
}
