import {
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { BookingRepository } from '../repository/booking.repository';
import { ShiftService } from 'src/shift/services/shift.service';
import { PaymentService } from 'src/payment/payment.service';
import { CreateBookingDto } from '../dto/createBooking.dto';

@Injectable()
export class BookingService {
    constructor(
        private readonly bookingrepository: BookingRepository,
        private readonly shiftService: ShiftService,
        @Inject(forwardRef(() => PaymentService))
        private readonly paymentService: PaymentService,
    ) {}

    async createBooking(createBookingDto: CreateBookingDto) {
        const isBooked = await this.bookingrepository.findBooking(
            createBookingDto.locationId,
            createBookingDto.courtId,
            createBookingDto.shiftId,
            createBookingDto.date,
        );

        if (isBooked) {
            throw new HttpException(
                'Sân vừa có người đặt rồi!',
                HttpStatus.CONFLICT,
            );
        }
        const shift = await this.shiftService.getShiftById(
            createBookingDto.shiftId,
        );
        const price = shift.price;

        const data = {
            ...createBookingDto,

            price,
        };
        const booking = await this.bookingrepository.createBooking(data);

        const resZaloPayment = await this.paymentService.createZaloPayment(
            price,
            booking[0].id.toString(),
        );
        return resZaloPayment.order_url;
    }

    async updateStatus(bookingId: number, status: string) {
        try {
            const existingBooking =
                await this.bookingrepository.findBookingById(bookingId);

            if (!existingBooking) {
                throw new NotFoundException('Booking not found');
            }

            existingBooking.status = status;
            await this.bookingrepository.update(existingBooking);

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

    async getTotalSalesInMonth(
        month: number,
        locationId: number,
        city: string,
    ) {
        const bookings = await this.bookingrepository.findBookingsSuccess();

        let totalSales = 0;

        let filteredBookings = locationId
            ? bookings.filter((booking) => booking.locationId === locationId)
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
                if (booking.shift.price) {
                    totalSales += booking.shift.price;
                }
            }
        });

        return {
            statusCode: HttpStatus.OK,
            message: 'success',
            data: {
                totalSales,
            },
        };
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

        return {
            statusCode: HttpStatus.OK,
            message: 'success',
            data: result,
        };
    }

    async getTransactionsInDay(today: string, locationId: string) {
        let bookings = await this.bookingrepository.findBookingsSuccess();
        if (locationId !== null && locationId != 'all') {
            bookings = bookings.filter((booking) => {
                return booking.locationId.toString() === locationId;
            });
        }
        const result = bookings.filter(
            (booking) => booking.createdAt == new Date(today),
        );

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
