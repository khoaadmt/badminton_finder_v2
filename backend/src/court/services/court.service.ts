import { Injectable } from '@nestjs/common';
import { CourtRepository } from '../repository/court.repository';
import { CreateCourtDto } from '../dto/createCourt.dto';
import { Types } from 'mongoose';

@Injectable()
export class CourtService {
  constructor(private readonly courtRepository: CourtRepository) {}

  async createCourt(createCourtDto: CreateCourtDto) {
    return await this.courtRepository.createCourt(createCourtDto);
  }

  async createCourts(locationId: Types.ObjectId, numberOfCourts: number) {
    for (var i = 0; i < numberOfCourts; i++) {
      const createCourtDto = {
        courtNumber: i + 1,
        locationId,
      };
      await this.courtRepository.createCourt(createCourtDto);
    }
  }
}
