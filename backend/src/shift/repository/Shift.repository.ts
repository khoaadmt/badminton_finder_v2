import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Shift } from '../entities/Shift.entity';
import { CreateShiftDto } from '../dto/createShift.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
require('dotenv').config();

@Injectable()
export class ShiftRepository {
    constructor(
        @InjectRepository(Shift)
        private ShiftRepo: Repository<Shift>,
    ) {}

    async create(createShiftDto: CreateShiftDto) {
        const newShift = this.ShiftRepo.create(createShiftDto);
        return await this.ShiftRepo.save(newShift);
    }

    async getShiftById(id: number) {
        return await this.ShiftRepo.findOne({ where: { id } });
    }

    async getShiftsByLocationId(locationId: number) {
        return await this.ShiftRepo.find({
            where: { location: { id: locationId } },
            relations: ['location'],
        });
    }
}
