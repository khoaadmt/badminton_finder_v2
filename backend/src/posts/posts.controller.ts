import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create_post.dto';
import { PostsService } from './services/posts.service';

@Controller('/posts')
export class PostsController {
    constructor(private readonly postService: PostsService) {}

    @Get('/filter')
    getPostByFilter(@Query() data: any) {
        if (data.filter) {
            return this.postService.getPostsByFilter(
                data.filter,
                data.page,
                data.city,
                data.latitude,
                data.longitude,
            );
        } else {
            return this.postService.getAllPosts(
                data.page,
                data.city,
                data.latitude,
                data.longitude,
            );
        }
    }

    @Get('/status/:status')
    async getPostByStatus(@Param('status') status) {
        return await this.postService.getPostByStatus(status);
    }

    @Get(':id')
    getPostById(@Param('id') id: number) {
        return this.postService.getPostById(id);
    }

    @Get('by-username/:username')
    getPostByUserName(@Param('username') username: string) {
        return this.postService.getPostByUserName(username);
    }

    // @Get()
    // getAllPosts(@Query('page') pageNumber: number, @Query('city') city: string) {
    //   return this.postService.getAllPosts(pageNumber, city);
    // }

    @Post()
    createPost(@Body() createPostDto: CreatePostDto) {
        console.log(createPostDto);
        return this.postService.createPost(createPostDto);
    }

    @Put(':postId/status')
    updateStatus(
        @Param('postId') postId: number,
        @Body('status') status: string,
    ) {
        return this.postService.updateStatus(postId, status);
    }

    @Delete(':postId')
    deletePost(@Param('postId') postId: number) {
        return this.postService.deletePost(postId);
    }
}
