import { Module } from '@nestjs/common';
import { CourtController } from './court.controller';
import { CourtService } from './services/court.service';
import { CourtRepository } from './repository/court.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Court } from './entities/court.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Court])],
    controllers: [CourtController],
    providers: [CourtService, CourtRepository],
})
export class CourtModule {}
