import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from '../schemas/booking.schema';
import { ObjectId } from 'mongodb';
import { Shift } from './../../shift/schemas/Shift.schema';
require('dotenv').config();

@Injectable()
export class BookingRepository {
  constructor(
    @InjectModel(Booking.name)
    private BookingModel: Model<Booking>,
  ) {}

  async createBooking(data: any) {
    return await this.BookingModel.create(data);
  }

  async updateBookingById(id: string) {
    return await this.BookingModel.findOneAndUpdate(
      { _id: id },
      { status: 'booked' },
      { new: true },
    );
  }

  async updateStatus(bookingId: string, status: string) {
    return await this.BookingModel.findByIdAndUpdate(bookingId, {
      status: 'cancel',
    });
  }

  async getBookedCourts(data: any) {
    const locationIdObj = new ObjectId(data.locationId);
    const shiftIdObj = new ObjectId(data.shiftId);
    return await this.BookingModel.find({
      locationId: locationIdObj,
      shiftId: shiftIdObj,
      date: data.date,
      status: 'booked',
    })
      .select('courtId')
      .lean()
      .exec();
  }

  async findBookingsByUsername(userName: string) {
    return await this.BookingModel.aggregate([
      // {
      //   $match: { status: 'booked', username: userName },
      // },
      {
        $lookup: {
          from: 'courts', // Collection name của court
          localField: 'courtId',
          foreignField: '_id',
          as: 'court',
        },
      },
      {
        $lookup: {
          from: 'shifts', // Collection name của shift
          localField: 'shiftId',
          foreignField: '_id',
          as: 'shift',
        },
      },
      {
        $lookup: {
          from: 'locations', // Collection name của location
          localField: 'locationId',
          foreignField: '_id',
          as: 'location',
        },
      },
      {
        $unwind: '$court',
      },
      {
        $unwind: '$shift',
      },
      {
        $unwind: '$location',
      },
      {
        $project: {
          _id: 1,
          username: 1,
          courtId: 1,
          shiftId: 1,
          locationId: 1,
          date: 1,
          price: 1,
          status: 1,
          createdAt: 1,
          court: { courtNumber: 1 }, // Chọn các field từ court
          shift: { shiftNumber: 1, startTime: 1, endTime: 1 }, // Chọn các field từ shift
          location: { name: 1, address: 1 }, // Chọn các field từ location
        },
      },
    ]);
  }

  async findBookingsSuccess() {
    return await this.BookingModel.aggregate([
      {
        $match: { status: 'booked' },
      },
      {
        $lookup: {
          from: 'courts', // Collection name của court
          localField: 'courtId',
          foreignField: '_id',
          as: 'court',
        },
      },
      {
        $lookup: {
          from: 'shifts', // Collection name của shift
          localField: 'shiftId',
          foreignField: '_id',
          as: 'shift',
        },
      },
      {
        $lookup: {
          from: 'locations', // Collection name của location
          localField: 'locationId',
          foreignField: '_id',
          as: 'location',
        },
      },
      {
        $unwind: '$court',
      },
      {
        $unwind: '$shift',
      },
      {
        $unwind: '$location',
      },
      {
        $project: {
          _id: 1,
          username: 1,
          courtId: 1,
          shiftId: 1,
          locationId: 1,
          date: 1,
          price: 1,
          status: 1,
          createdAt: 1,
          court: { courtNumber: 1 }, // Chọn các field từ court
          shift: { startTime: 1, endTime: 1 }, // Chọn các field từ shift
          location: { name: 1, city: 1 }, // Chọn các field từ location
        },
      },
    ]);
  }

  async findBooking(
    locationId: ObjectId,
    courtId: ObjectId,
    shiftId: ObjectId,
    date: string,
  ) {
    return await this.BookingModel.findOne({
      locationId,
      courtId,
      shiftId,
      date,
      status: 'booked',
    });
  }
}
