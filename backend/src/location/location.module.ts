import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './services/location.service';
import { LocationRepository } from './repository/location.repository';
import { CourtRepository } from 'src/court/repository/court.repository';
import { CourtService } from 'src/court/services/court.service';
import { Shift } from 'src/shift/entities/Shift.entity';
import { ShiftRepository } from 'src/shift/repository/Shift.repository';
import { ShiftService } from 'src/shift/services/shift.service';
import { CheckPermissionMiddleware } from 'src/middlewares/checkPermission.middleware';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from './entities/location.entity';
import { Court } from 'src/court/entities/court.entity';
import { UserRepository } from 'src/user/repository/user.repository';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([LocationEntity, Shift, Court, User]),
        AuthModule,
        UserModule,
    ],
    controllers: [LocationController],
    providers: [
        LocationService,
        LocationRepository,
        CourtService,
        CourtRepository,
        ShiftService,
        ShiftRepository,
        CheckPermissionMiddleware,
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
