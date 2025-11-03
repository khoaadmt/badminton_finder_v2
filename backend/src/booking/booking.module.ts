import { Module, forwardRef } from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { BookingController } from './booking.controller';
import { BookingRepository } from './repository/booking.repository';
import { PaymentService } from 'src/payment/payment.service';
import { ShiftModule } from 'src/shift/shift.module';
import { PaymentModule } from 'src/payment/payment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';

@Module({
    imports: [
        forwardRef(() => PaymentModule),
        TypeOrmModule.forFeature([Booking]),
        ShiftModule,
    ],
    controllers: [BookingController],
    providers: [BookingService, BookingRepository],
    exports: [BookingService],
})
export class BookingModule {}
