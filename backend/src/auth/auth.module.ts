import {
    Module,
    NestModule,
    MiddlewareConsumer,
    RequestMethod,
} from '@nestjs/common';

import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { FacebookStrategy } from './utils/FaceBookStrategy';
import { AuthService } from './services/auth.service';
import { VerifyTokenMiddleware } from 'src/middlewares/logging.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repository/user.repository';
import { CheckPermissionMiddleware } from 'src/middlewares/checkPermission.middleware';
require('dotenv').config();

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [AuthService, GoogleStrategy, FacebookStrategy, UserRepository],
    controllers: [AuthController],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(VerifyTokenMiddleware)
            .forRoutes({ path: 'auth/logout', method: RequestMethod.POST });
    }
}
