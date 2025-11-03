import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Court } from '../entities/court.entity';
import { CreateCourtDto } from '../dto/createCourt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
require('dotenv').config();

@Injectable()
export class CourtRepository {
    constructor(
        @InjectRepository(Court)
        private CourtRepo: Repository<Court>,
    ) {}

    async createCourt(createCourtDto: CreateCourtDto) {
        const newCourt = this.CourtRepo.create(createCourtDto);
        return await this.CourtRepo.save(newCourt);
    }
}
