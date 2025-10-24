import { Module, forwardRef } from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingController } from './booking.controller';
import { BookingRepository } from './repository/booking.repository';
import { Shift, ShiftSchema } from 'src/shift/schemas/Shift.schema';
import { ShiftService } from 'src/shift/services/shift.service';
import { PaymentService } from 'src/payment/payment.service';
import { ShiftModule } from 'src/shift/shift.module';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [
    forwardRef(() => PaymentModule),
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    ShiftModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
  exports: [BookingService],
})
export class BookingModule {}
