import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Shift } from '../schemas/Shift.schema';
import { CreateShiftDto } from '../dto/createShift.dto';
require('dotenv').config();

@Injectable()
export class ShiftRepository {
  constructor(
    @InjectModel(Shift.name)
    private ShiftModel: Model<Shift>,
  ) {}

  async createShift(createShiftDto: CreateShiftDto) {
    return await this.ShiftModel.create(createShiftDto);
  }

  async getShiftById(id: string) {
    return await this.ShiftModel.findById(id);
  }

  async getShiftsByLocationId(LocationId: Types.ObjectId) {
    return await this.ShiftModel.find({ locationId: LocationId });
  }
}
