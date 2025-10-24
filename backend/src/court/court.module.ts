import { Module } from '@nestjs/common';
import { CourtController } from './court.controller';
import { CourtService } from './services/court.service';
import { CourtRepository } from './repository/court.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Court, CourtSchema } from './schemas/court.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Court.name, schema: CourtSchema }]),
  ],
  controllers: [CourtController],
  providers: [CourtService, CourtRepository],
})
export class CourtModule {}
