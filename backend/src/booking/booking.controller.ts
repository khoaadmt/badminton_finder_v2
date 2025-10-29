import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    Res,
} from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { CreateBookingDto } from './dto/createBooking.dto';
import { query } from 'express';

@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    @Post('')
    createBooking(@Body() createBookingDto: CreateBookingDto) {
        return this.bookingService.createBooking(createBookingDto);
    }

    @Get('booked-courts')
    getBookingById(@Query() data: any) {
        return this.bookingService.getBookedCourts(data);
    }

    @Get('/by-username/:username')
    getBookingByUsername(@Param('username') username: string) {
        return this.bookingService.getBookingByUsername(username);
    }

    @Get(':month/total-sales')
    getTotalSalesInMonth(
        @Param('month') month: number,
        @Query('locationId') locationId: string,
        @Query('city') city: string,
    ) {
        return this.bookingService.getTotalSalesInMonth(
            month,
            locationId,
            city,
        );
    }

    @Get('/transactions')
    getAllTransactions(@Query('locationId') locationId: string) {
        return this.bookingService.getAllTransactions(locationId);
    }

    @Get(':month/month/transactions')
    getTransactionsInMonth(
        @Param('month') month: number,
        @Query('locationId') locationId: string,
    ) {
        return this.bookingService.getTransactionsInMonth(month, locationId);
    }

    @Get(':day/day/transactions')
    getTransactionsInDay(
        @Param('day') day: string,
        @Query('locationId') locationId: string,
    ) {
        return this.bookingService.getTransactionsInDay(day, locationId);
    }

    @Put('/status')
    updateStatus(@Body('bookingId') bookingId: number, status: string) {
        return this.bookingService.updateStatus(bookingId, status);
    }
}
