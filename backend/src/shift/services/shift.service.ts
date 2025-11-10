import { Injectable } from '@nestjs/common';
import { CreateShiftDto } from '../dto/createShift.dto';
import { ShiftRepository } from '../repository/Shift.repository';

@Injectable()
export class ShiftService {
    constructor(private readonly shiftRepository: ShiftRepository) {}

    async createShift(createShiftDto: CreateShiftDto) {
        const newShift = await this.shiftRepository.create(createShiftDto);
    }

    async getShiftById(id: number) {
        return await this.shiftRepository.getShiftById(id);
    }

    async getShiftsByLocationId(locationId: number) {
        this.shiftRepository.getShiftsByLocationId(locationId);
    }
}
