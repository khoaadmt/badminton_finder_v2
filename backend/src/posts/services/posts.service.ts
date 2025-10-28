import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostRepository } from '../repository/post.repository';
import { CreatePostDto } from '../dto/create_post.dto';
import * as dayjs from 'dayjs';
import { LocationService } from 'src/location/services/location.service';
import * as Bluebird from 'bluebird';
interface FilterOptions {
    agreement: string;
    date: string;
    distance: string;
    gender: string;
    level: string;
    memberCount: string;
    price: string;
    sortBy: string;
    time: string;
}
@Injectable()
export class PostsService {
    private readonly pageLimit = 6;
    constructor(
        private readonly postRepository: PostRepository,
        private readonly locationService: LocationService,
    ) {}

    async getAllPosts(
        pageNumber: number,
        city: string,
        latitude: number,
        longitude: number,
    ) {
        const posts = await this.postRepository.findAllPost(city);

        let skip = (pageNumber - 1) * this.pageLimit;
        const result = posts.slice(skip, skip + this.pageLimit);

        const postsWithDistance = await Bluebird.map(result, async (post) => {
            console.log(
                latitude,
                longitude,
                post.location.latitude,
                post.location.longitude,
            );
            const distance =
                await this.locationService.realDistanceBetween2Points(
                    latitude,
                    longitude,
                    post.location.latitude,
                    post.location.longitude,
                );

            return { ...post, distance };
        });

        return {
            rows: postsWithDistance,
            totalPosts: posts.length,
            page: pageNumber,
        };
    }

    async getPostById(id: number) {
        const post = await this.postRepository.findById(id);
        if (!post) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
        return post;
    }

    async getPostByUserName(userName: string) {
        const post = await this.postRepository.findByUserName(userName);
        return post;
    }

    async getPostByStatus(status: string) {
        return await this.postRepository.findPostByStatus(status);
    }

    async updateStatus(postId: number, status: string) {
        const existingPost = await this.postRepository.findById(postId);

        if (!existingPost) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
        try {
            existingPost.status = status;
            await this.postRepository.update(existingPost);

            return { message: 'Update status success' };
        } catch (err) {
            throw new HttpException(
                'Update status failed',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async deletePost(postId: number) {
        const existingPost = await this.postRepository.findById(postId);
        if (!existingPost) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
        try {
            await this.postRepository.delete(postId);
            return { message: 'Delete post success' };
        } catch (err) {
            throw new HttpException(
                'Delete post failed',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    converBoolean = (value: string) => {
        if (value == 'true') return true;
        else return false;
    };

    filteredPosts = (posts, filter: FilterOptions) => {
        const filteredPosts = posts.filter((post) => {
            const level =
                filter?.level != null ? parseInt(filter.level, 10) : null;

            const agreement =
                filter?.agreement != null
                    ? this.converBoolean(filter.agreement)
                    : null;
            let price = null;

            const dateConvert = dayjs(post.startTime, 'YYYY-MM-DD HH:mm');
            const startDate = dateConvert.format('YYYY-MM-DD');
            const startTime = dateConvert.format('HH:mm');

            if (!agreement) {
                price =
                    filter?.price != null ? parseInt(filter.price, 10) : null;
            }

            return (
                (level == null ||
                    (post.levelMemberMin <= level &&
                        post.levelMemberMax >= level)) &&
                (price == null ||
                    (post.priceMin <= price && post.priceMax >= price)) &&
                (filter?.memberCount == null ||
                    post.memberCount == filter.memberCount) &&
                (filter?.gender == null || post.gender == filter.gender) &&
                (filter?.date == null || filter.date == startDate) &&
                (filter?.time == null || filter.time == startTime) &&
                (agreement == null || post.agreement == agreement)
            );
        });

        if (filter.sortBy) {
            filteredPosts.sort((a, b) => {
                return a.startTime - b.startTime;
            });
        }
        return filteredPosts;
    };

    async getPostsByFilter(
        filter: FilterOptions,
        pageNumber: number,
        city: string,
        latitude: number,
        longitude: number,
    ) {
        const posts = await this.postRepository.findAllPost(city);

        const filteredPosts = this.filteredPosts(posts, filter);

        let postsWithDistance = await Bluebird.map(
            filteredPosts,
            async (post) => {
                const distance =
                    await this.locationService.realDistanceBetween2Points(
                        latitude,
                        longitude,
                        post.location.latitude,
                        post.location.longitude,
                    );
                return { ...post, distance };
            },
        );

        if (filter.distance != null) {
            postsWithDistance = await postsWithDistance.filter((post) => {
                console.log(
                    'first: ',
                    post.distance.value,
                    post.distance.value <= parseInt(filter.distance) * 1000,
                );
                return post.distance.value <= parseInt(filter.distance) * 1000;
            });
        }

        let skip = (pageNumber - 1) * this.pageLimit;
        const result = postsWithDistance.slice(skip, skip + this.pageLimit);
        return {
            rows: result,
            totalPosts: postsWithDistance.length,
            page: pageNumber,
        };
    }

    async createPost(createPostDto: CreatePostDto) {
        try {
            const dateTime = new Date(
                createPostDto.date + 'T' + createPostDto.time,
            );
            const startTime = dateTime.getTime();

            const { date, time, ...rest } = createPostDto;
            const newCreatePostDto = { ...rest, startTime };
            const newPost =
                await this.postRepository.createPost(newCreatePostDto);

            return {
                statusCode: HttpStatus.CREATED,
                message: 'Create post success',
                data: {
                    newPost,
                },
            };
        } catch (error) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Create post failed',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateImagesOfPost(postId: number, urlImage: string[]) {
        try {
            const existingPost = await this.postRepository.findById(postId);

            if (!existingPost) {
                throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
            }

            existingPost.images = urlImage;

            const updatedPost = await this.postRepository.update(existingPost);

            return {
                statusCode: HttpStatus.OK,
                message: 'Update post success',
                data: updatedPost,
            };
        } catch (err) {
            throw new HttpException(
                err.message || 'Failed to update post',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
