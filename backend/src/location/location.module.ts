import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LocationController } from './location.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationService } from './services/location.service';
import { LocationRepository } from './repository/location.repository';
import { Location, LocationSchema } from './schemas/location.schema';
import { CourtRepository } from 'src/court/repository/court.repository';
import { CourtService } from 'src/court/services/court.service';
import { CourtModule } from 'src/court/court.module';
import { Court, CourtSchema } from 'src/court/schemas/court.schema';
import { Shift, ShiftSchema } from 'src/shift/schemas/Shift.schema';
import { ShiftRepository } from 'src/shift/repository/Shift.repository';
import { ShiftService } from 'src/shift/services/shift.service';
import { CheckPermissionMiddleware } from 'src/middlewares/checkPermission.middleware';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
    MongooseModule.forFeature([{ name: Court.name, schema: CourtSchema }]),
    MongooseModule.forFeature([{ name: Shift.name, schema: ShiftSchema }]),
    AuthModule,
  ],
  controllers: [LocationController],
  providers: [
    LocationService,
    LocationRepository,
    CourtService,
    CourtRepository,
    ShiftService,
    ShiftRepository,
  ],
  exports: [LocationService],
})
export class LocationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckPermissionMiddleware)
      .forRoutes(
        { path: 'locations/:locations', method: RequestMethod.DELETE },
        { path: 'locations/:locations', method: RequestMethod.PUT },
        { path: 'locations', method: RequestMethod.POST },
      );
  }
}
