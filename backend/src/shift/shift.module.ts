import { Module } from '@nestjs/common';
import { ShiftService } from './services/shift.service';
import { ShiftRepository } from './repository/Shift.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from './entities/Shift.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Shift])],
    providers: [ShiftService, ShiftRepository],
    exports: [ShiftService],
})
export class ShiftModule {}
