import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { PostsController } from './posts.controller';

import { PostsService } from './services/posts.service';
import { PostRepository } from './repository/post.repository';
import { VerifyTokenMiddleware } from 'src/middlewares/logging.middleware';
import { LocationModule } from 'src/location/location.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Post]), LocationModule],
    controllers: [PostsController],
    providers: [PostsService, PostRepository],
    exports: [PostsService],
})
export class PostsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(VerifyTokenMiddleware)
            .forRoutes({ path: 'posts/', method: RequestMethod.POST });
    }
}
