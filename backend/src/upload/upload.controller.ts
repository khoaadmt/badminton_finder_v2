import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFiles,
    Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { storageOptions } from 'helpers/config';
import { PostsService } from 'src/posts/services/posts.service';

@Controller('upload')
export class UploadController {
    constructor(private readonly postService: PostsService) {}

    @Post('post')
    @UseInterceptors(
        FilesInterceptor('files', 10, { storage: storageOptions('post') }),
    )
    async uploadPostFiles(
        @Body('postId') postId: number,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        const urlFiles = files.map((file) => {
            const url = `http://localhost:5000/api/uploads/post/${file.filename}`;
            return url;
        });

        return await this.postService.updateImagesOfPost(postId, urlFiles);
    }

    @Post('location')
    @UseInterceptors(
        FilesInterceptor('files', 10, { storage: storageOptions('location') }),
    )
    async uploadLocationFiles(@UploadedFiles() files: Express.Multer.File[]) {
        const urlFiles = files.map((file) => {
            const url = `http://localhost:5000/api/uploads/location/${file.filename}`;
            return url;
        });

        return urlFiles;
    }

    @Post('avatar')
    @UseInterceptors(
        FilesInterceptor('files', 1, { storage: storageOptions('avatar') }),
    )
    uploadAvatarFile(@UploadedFiles() files: Express.Multer.File[]) {
        const uploadedFiles = files.map((file) => ({
            url: `http://localhost:5000/api/uploads/avatar/${file.filename}`,
            name: file.filename,
            status: 'done',
            uid: file.filename,
        }));
        return uploadedFiles;
    }
}
