import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from '../Dto/createLocation.dto';
import { ObjectId } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationEntity } from '../entities/location.entity';
import { Repository } from 'typeorm';
require('dotenv').config();

@Injectable()
export class LocationRepository {
    private readonly pageLimit = 6;
    constructor(
        @InjectRepository(LocationEntity)
        private locationRepo: Repository<LocationEntity>,
    ) {}

    async update(locationId: number, locationUpdate: Partial<LocationEntity>) {
        return await this.locationRepo.update(
            { id: locationId },
            locationUpdate,
        );
    }

    async delete(locationId) {
        return await this.locationRepo.delete({ id: locationId });
    }

    async createLocation(createLocationDto: CreateLocationDto) {
        const newLocation = this.locationRepo.create(createLocationDto);
        return await this.locationRepo.save(newLocation);
    }

    async countLocationsByCity(city: string) {
        return await this.locationRepo.count({ where: { city: city } });
    }

    async findById(id: number) {
        return await this.locationRepo.findOne({
            where: { id },
            relations: ['courts', 'shifts'],
        });
    }

    async finAllLocations() {
        return this.locationRepo.find();
    }

    async findByCity(city: string, pageNumber: number) {
        const locations = await this.locationRepo.find({
            where: { city },
            skip: (pageNumber - 1) * this.pageLimit,
            take: this.pageLimit,
        });

        return locations;
    }
}
