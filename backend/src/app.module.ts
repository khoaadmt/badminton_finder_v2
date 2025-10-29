import { Module } from '@nestjs/common';
import * as crypto from 'crypto';
(globalThis as any).crypto = crypto;

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LocationModule } from './location/location.module';
import { PostsModule } from './posts/posts.module';
import { BookingModule } from './booking/booking.module';
import { CourtModule } from './court/court.module';
import { ShiftModule } from './shift/shift.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),

        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const databaseUrl = configService.get<string>('DATABASE_URL');
                return {
                    type: 'postgres',
                    url: databaseUrl,
                    ssl: { rejectUnauthorized: false },
                    autoLoadEntities: true,
                    synchronize: true,
                };
            },
            inject: [ConfigService],
        }),
        LocationModule,
        PostsModule,
        AuthModule,
        // UploadModule,
        UserModule,
        // PaymentModule,
        CourtModule,
        ShiftModule,
        BookingModule,
    ],
    providers: [],
})
export class AppModule {}
