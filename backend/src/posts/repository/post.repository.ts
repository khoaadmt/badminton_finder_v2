import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../entities/post.entity';
import { ObjectId } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostRepository {
    constructor(
        @InjectRepository(Post)
        private postRepo: Repository<Post>,
    ) {}

    async findAllPost(city: string) {
        const currentTimestamp = Date.now();

        const posts = await this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.location', 'location')
            .leftJoinAndSelect('post.user', 'user')
            .where('location.city = :city', { city })
            .andWhere('post.startTime > :currentTimestamp', {
                currentTimestamp,
            })
            .andWhere('post.status = :status', { status: 'checked' })
            .select([
                'post',
                'location',
                'user.id',
                'user.username',
                'user.email',
                'user.avatarUrl',
            ])
            .getMany();

        return posts;
    }

    async findPostByStatus(status: string) {
        const currentTimestamp = Date.now();

        const posts = await this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.location', 'location')
            .leftJoinAndSelect('post.user', 'user')
            .where('post.startTime > :currentTimestamp', {
                currentTimestamp,
            })
            .andWhere('post.status = :status', { status })
            .select([
                'post',
                'location',
                'user.id',
                'user.username',
                'user.email',
                'user.avatarUrl',
            ])
            .getMany();

        return posts;
    }

    async findById(id: number) {
        const post = await this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.location', 'location')
            .leftJoinAndSelect('post.user', 'user')
            .where('post.id = :id', { id })
            .select([
                'post',
                'location',
                'user.id',
                'user.username',
                'user.email',
                'user.avatarUrl',
            ])
            .getOne();
        return post;
    }

    async findByUserName(username: string) {
        const post = await this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.location', 'location')
            .leftJoinAndSelect('post.user', 'user')
            .where('user.username = :username', { username })
            .select([
                'post',
                'location',
                'user.id',
                'user.username',
                'user.email',
                'user.avatarUrl',
            ])
            .getOne();

        return post;
    }

    async update(post: Post) {
        return await this.postRepo.save(post);
    }

    async countPosts() {
        return await this.postRepo.count();
    }

    async createPost(newPost) {
        return await this.postRepo.create(newPost);
    }

    async delete(postId: number) {
        await this.postRepo.delete({ id: postId });
    }
}
