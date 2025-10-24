import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PostsController } from './posts.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './shemas/post.schema';
import { PostsService } from './services/posts.service';
import { PostRepository } from './repository/post.repository';
import { VerifyTokenMiddleware } from 'src/middlewares/logging.middleware';
import { LocationModule } from 'src/location/location.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    LocationModule,
  ],
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
