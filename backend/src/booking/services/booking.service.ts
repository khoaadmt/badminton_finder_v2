import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Req,
  Res,
  forwardRef,
} from '@nestjs/common';
import { BookingRepository } from '../repository/booking.repository';
import { CreateBookingDto } from '../dto/createBooking.dto';
import { ShiftService } from 'src/shift/services/shift.service';
import { PaymentService } from 'src/payment/payment.service';
import { ObjectId } from 'mongodb';

const dayjs = require('dayjs');

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingrepository: BookingRepository,
    private readonly shiftService: ShiftService,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
  ) {}

  async createBooking(createBookingDto: CreateBookingDto) {
    const courtIdObj = new ObjectId(createBookingDto.courtId);
    const locationIdObj = new ObjectId(createBookingDto.locationId);
    const shiftIdObj = new ObjectId(createBookingDto.shiftId);

    const isBooked = await this.bookingrepository.findBooking(
      locationIdObj,
      courtIdObj,
      shiftIdObj,
      createBookingDto.date,
    );

    if (isBooked) {
      throw new HttpException('Sân vừa có người đặt rồi!', HttpStatus.CONFLICT);
    }
    const shift = await this.shiftService.getShiftById(
      createBookingDto.shiftId.toString(),
    );
    const price = shift.price;
    const date = dayjs().format('YYYY-MM-DD');

    const data = {
      ...createBookingDto,
      username: createBookingDto.userName,
      price,
      locationId: locationIdObj,
      shiftId: shiftIdObj,
      courtId: courtIdObj,
      createdAt: date,
    };
    const booking = await this.bookingrepository.createBooking(data);

    const resZaloPayment = await this.paymentService.createZaloPayment(
      price,
      booking._id.toString(),
    );
    return resZaloPayment.order_url;
  }

  async updateBookingById(id: string) {
    return await this.bookingrepository.updateBookingById(id);
  }

  async updateStatus(bookingId: string) {
    try {
      const status = 'cancel';
      await this.bookingrepository.updateStatus(bookingId, status);
      return { message: 'update status success' };
    } catch (err) {
      console.log('Error:', err);
    }
  }
  async getBookedCourts(data: any) {
    const bookedCourts = await this.bookingrepository.getBookedCourts(data);
    return bookedCourts.map((bookedCourt) => {
      return bookedCourt.courtId.toString();
    });
  }

  async getBookingByUsername(username: string) {
    const bookings =
      await this.bookingrepository.findBookingsByUsername(username);

    const now = new Date();
    const updatedBookings = bookings.map((booking) => {
      const bookingDate = new Date(
        `${booking.date}T${booking.shift.startTime}:00`,
      );

      const isFutureBooking = bookingDate > now;

      return {
        ...booking,
        isFutureBooking,
      };
    });

    return updatedBookings;
  }

  async getTotalSalesInMonth(month: number, locationId: string, city: string) {
    const bookings = await this.bookingrepository.findBookingsSuccess();

    let totalSales = 0;

    let filteredBookings = locationId
      ? bookings.filter(
          (booking) => booking.locationId.toString() === locationId,
        )
      : bookings;

    if (city) {
      filteredBookings = bookings.filter((booking) => {
        return booking.location.city === city;
      });
    }

    filteredBookings.forEach((booking) => {
      const date = new Date(booking.createdAt);
      const m = date.getMonth() + 1;
      if (month == m) {
        if (booking.price) {
          totalSales += booking.price;
        }
      }
    });

    return totalSales;
  }

  async getTransactionsInMonth(month: number, locationId: string) {
    let bookings = await this.bookingrepository.findBookingsSuccess();
    if (locationId !== null && locationId != 'all') {
      bookings = bookings.filter((booking) => {
        return booking.locationId.toString() === locationId;
      });
    }
    var result = [];
    bookings.forEach((booking) => {
      const date = new Date(booking.createdAt);
      const m = date.getMonth() + 1;
      if (month == m) {
        result.push(booking);
      }
    });

    return result;
  }

  async getTransactionsInDay(day: string, locationId: string) {
    let bookings = await this.bookingrepository.findBookingsSuccess();
    if (locationId !== null && locationId != 'all') {
      bookings = bookings.filter((booking) => {
        return booking.locationId.toString() === locationId;
      });
    }
    const result = bookings.filter((booking) => booking.createdAt == day);

    return result;
  }

  async getAllTransactions(locationId: string) {
    let bookings = await this.bookingrepository.findBookingsSuccess();
    if (locationId !== null && locationId != 'all') {
      bookings = bookings.filter((booking) => {
        return booking.locationId.toString() === locationId;
      });
    }
    return bookings;
  }
}
