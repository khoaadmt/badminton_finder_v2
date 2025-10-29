import { HttpStatus, Injectable } from '@nestjs/common';
import { Post } from '../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class PostRepository {
    constructor(
        @InjectRepository(Post)
        private postRepo: Repository<Post>,
    ) {}

    async findAllPost(city: string) {
        const currentTimestamp = Date.now();

        const posts = await this.postRepo.find({
            relations: ['location', 'user'],
            where: {
                location: { city },
                startTime: MoreThan(new Date()),
                status: 'checked',
            },
        });

        return posts;
    }

    async findPostByStatus(status: string) {
        const currentTimestamp = new Date();

        const posts = await this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.location', 'location')
            .leftJoin('post.user', 'user')
            .addSelect([
                'user.id',
                'user.displayName',
                'user.username',
                'user.avaUrl',
            ])
            .where('post.startTime > :currentTimestamp', { currentTimestamp })
            .andWhere('post.status = :status', { status })
            .getMany();

        return {
            statusCode: HttpStatus.OK,
            message: 'success',
            data: {
                posts,
            },
        };
    }

    async findById(id: number) {
        const post = await this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.location', 'location')
            .leftJoin('post.user', 'user')
            .addSelect([
                'user.id',
                'user.displayName',
                'user.username',
                'user.avaUrl',
            ])
            .where('post.id = :id', { id })
            .getOne();
        return post;
    }

    async findByUserName(username: string) {
        const posts = await this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.location', 'location')
            .leftJoin('post.user', 'user')
            .addSelect([
                'user.id',
                'user.displayName',
                'user.username',
                'user.avaUrl',
            ])
            .where('user.username = :username', { username })
            .getMany();

        console.log('posts :', posts);
        return posts;
    }

    async update(post: Post) {
        return await this.postRepo.save(post);
    }

    async countPosts() {
        return await this.postRepo.count();
    }

    async createPost(newPost) {
        return await this.postRepo.save(newPost);
    }

    async delete(postId: number) {
        await this.postRepo.delete({ id: postId });
    }
}
