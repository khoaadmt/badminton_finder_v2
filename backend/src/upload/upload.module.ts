import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [PostsModule],
  controllers: [UploadController],
})
export class UploadModule {}
