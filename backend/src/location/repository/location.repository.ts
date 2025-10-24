import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location } from '../schemas/location.schema';
import { CreateLocationDto } from '../Dto/createLocation.dto';
import { ObjectId } from 'mongodb';
require('dotenv').config();

@Injectable()
export class LocationRepository {
  private readonly pageLimit = 6;
  constructor(
    @InjectModel(Location.name)
    private LocationModel: Model<Location>,
  ) {}

  async update(locationId, updateLocationDto: CreateLocationDto) {
    return await this.LocationModel.findByIdAndUpdate(
      locationId,
      updateLocationDto,
      { new: true },
    );
  }

  async delete(locationId) {
    return await this.LocationModel.findByIdAndDelete(locationId);
  }
  async createLocation(createLocationDto: CreateLocationDto) {
    return await this.LocationModel.create(createLocationDto);
  }
  async countLocationsByCity(city: string) {
    return await this.LocationModel.countDocuments({ city: city });
  }

  async findById(id: string) {
    const objectId = new ObjectId(id);

    return await this.LocationModel.aggregate([
      {
        $lookup: {
          from: 'courts',
          localField: '_id',
          foreignField: 'locationId',
          as: 'courts',
        },
      },
      {
        $lookup: {
          from: 'shifts',
          localField: '_id',
          foreignField: 'locationId',
          as: 'shifts',
        },
      },
      {
        $match: {
          _id: objectId,
        },
      },
    ]);
  }

  async finAllLocations() {
    return this.LocationModel.find().lean();
  }

  async findByCity(city: string, pageNumber: number) {
    const locations = await this.LocationModel.find({ city: city })
      .skip((pageNumber - 1) * this.pageLimit)
      .limit(this.pageLimit)
      .lean();
    return locations;
  }
}
