import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Court } from '../schemas/court.schema';
import { CreateCourtDto } from '../dto/createCourt.dto';
require('dotenv').config();

@Injectable()
export class CourtRepository {
  constructor(
    @InjectModel(Court.name)
    private CourtModel: Model<Court>,
  ) {}

  async createCourt(createCourtDto: CreateCourtDto) {
    return await this.CourtModel.create(createCourtDto);
  }
}
