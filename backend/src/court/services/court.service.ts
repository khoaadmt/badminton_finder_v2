import { Injectable } from '@nestjs/common';
import { CourtRepository } from '../repository/court.repository';
import { CreateCourtDto } from '../dto/createCourt.dto';
import { LocationEntity } from 'src/location/entities/location.entity';

@Injectable()
export class CourtService {
    constructor(private readonly courtRepository: CourtRepository) {}

    async createCourt(createCourtDto: CreateCourtDto) {
        return await this.courtRepository.createCourt(createCourtDto);
    }

    async createCourts(location: LocationEntity, numberOfCourts: number) {
        for (var i = 0; i < numberOfCourts; i++) {
            const createCourtDto = {
                courtNumber: i + 1,
                location,
            };
            await this.courtRepository.createCourt(createCourtDto);
        }
    }
}
