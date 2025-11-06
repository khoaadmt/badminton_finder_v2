import { Injectable } from '@nestjs/common';
import { Booking } from '../entities/booking.entity';
import { ObjectId } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
require('dotenv').config();

@Injectable()
export class BookingRepository {
    constructor(
        @InjectRepository(Booking)
        private bookingRepo: Repository<Booking>,
    ) {}

    async createBooking(data: Partial<Booking>): Promise<Booking> {
        const newBooking = this.bookingRepo.create(data);
        await this.bookingRepo.save(newBooking);
        return newBooking;
    }

    async update(bookingUpdate: Booking) {
        return await this.bookingRepo.save(bookingUpdate);
    }

    async getBookedCourts(data: any) {
        return await this.bookingRepo.find({
            where: {
                locationId: data.locationId,
                shiftId: data.shiftId,
                date: data.date,
                status: 'booked',
            },
        });
    }

    async findBookingsByUsername(userName: string) {
        const bookings = await this.bookingRepo
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.location', 'location')
            .leftJoinAndSelect('booking.court', 'court')
            .leftJoinAndSelect('booking.shift', 'shift')
            .leftJoin('booking.user', 'user')
            .addSelect([
                'user.id',
                'user.displayName',
                'user.username',
                'user.avaUrl',
            ])
            .where('booking.username = :username', { username: userName })
            .getMany();
        return bookings;
    }

    async findBookingsSuccess() {
        const bookings = await this.bookingRepo
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.location', 'location')
            .leftJoinAndSelect('booking.court', 'court')
            .leftJoinAndSelect('booking.shift', 'shift')
            .leftJoin('booking.user', 'user')
            .addSelect([
                'user.id',
                'user.displayName',
                'user.username',
                'user.avaUrl',
            ])
            .where('booking.status = :status', { status: 'booked' })
            .getMany();

        return bookings;
    }

    async findBookingById(id: number) {
        return await this.bookingRepo.findOne({
            where: {
                id,
            },
        });
    }

    async findBooking(
        locationId: number,
        courtId: number,
        shiftId: number,
        date: string,
    ) {
        return await this.bookingRepo.findOne({
            where: {
                locationId,
                courtId,
                shiftId,
                date: new Date(date),
                status: 'booked',
            },
        });
    }
}
