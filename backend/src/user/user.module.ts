import {
    Module,
    NestModule,
    MiddlewareConsumer,
    RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { VerifyTokenMiddleware } from 'src/middlewares/logging.middleware';
import { UserRepository } from './repository/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserRepository, UserService],
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(VerifyTokenMiddleware)
            .forRoutes({ path: 'user/:username', method: RequestMethod.PUT });
    }
}
