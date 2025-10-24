import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shift, ShiftSchema } from './schemas/Shift.schema';
import { ShiftService } from './services/shift.service';
import { ShiftRepository } from './repository/Shift.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shift.name, schema: ShiftSchema }]),
  ],
  providers: [ShiftService, ShiftRepository],
  exports: [ShiftService],
})
export class ShiftModule {}
