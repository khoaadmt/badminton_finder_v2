import { Injectable } from '@nestjs/common';
import { CreateShiftDto } from '../dto/createShift.dto';
import { ShiftRepository } from '../repository/Shift.repository';
import { Types } from 'mongoose';

@Injectable()
export class ShiftService {
  constructor(private readonly shiftRepository: ShiftRepository) {}

  async createShift(createShiftDto: CreateShiftDto) {
    await this.shiftRepository.createShift(createShiftDto);
  }

  async getShiftById(id: string) {
    return await this.shiftRepository.getShiftById(id);
  }

  async getShiftsByLocationId(locationId: Types.ObjectId) {
    this.shiftRepository.getShiftsByLocationId(locationId);
  }
}
