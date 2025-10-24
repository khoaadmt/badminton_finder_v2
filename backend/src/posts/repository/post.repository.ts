import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../shemas/post.schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name)
    private Post: Model<Post>,
  ) {}

  async finAllPost(city) {
    const currentDate = new Date();
    const currentTimestamp = currentDate.getTime();

    return await this.Post.aggregate([
      {
        $addFields: {
          location_id_ObjectId: { $toObjectId: '$location_id' },
        },
      },
      {
        $lookup: {
          from: 'locations',
          localField: 'location_id_ObjectId',
          foreignField: '_id',
          as: 'location',
        },
      },
      {
        $unwind: '$location',
      },
      {
        $match: { 'location.city': city },
      },
      {
        $match: { startTime: { $gt: currentTimestamp } },
      },
      {
        $match: { status: 'checked' },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'username',
          foreignField: 'username',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          location_id_ObjectId: 0,
          location_id: 0,
          'user._id': 0,
          'user.password': 0,
          'user.accessToken': 0,
          'user.refreshToken': 0,
        },
      },
    ]);
  }

  async findPostByStatus(status: string) {
    const currentDate = new Date();
    const currentTimestamp = currentDate.getTime();

    return await this.Post.aggregate([
      {
        $addFields: {
          location_id_ObjectId: { $toObjectId: '$location_id' },
        },
      },
      {
        $lookup: {
          from: 'locations',
          localField: 'location_id_ObjectId',
          foreignField: '_id',
          as: 'location',
        },
      },
      {
        $unwind: '$location',
      },
      {
        $match: { startTime: { $gt: currentTimestamp } },
      },
      {
        $match: { status: status },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'username',
          foreignField: 'username',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          location_id_ObjectId: 0,
          location_id: 0,
          'user._id': 0,
          'user.password': 0,
          'user.accessToken': 0,
          'user.refreshToken': 0,
        },
      },
    ]);
  }

  async findById(id: string) {
    const objectId = new ObjectId(id);

    return await this.Post.aggregate([
      {
        $addFields: {
          location_id_ObjectId: { $toObjectId: '$location_id' },
        },
      },
      {
        $match: { _id: objectId },
      },
      {
        $lookup: {
          from: 'locations',
          localField: 'location_id_ObjectId',
          foreignField: '_id',
          as: 'location',
        },
      },
      {
        $unwind: '$location',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'username',
          foreignField: 'username',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          location_id_ObjectId: 0,
          location_id: 0,
          'user._id': 0,
          'user.password': 0,
          'user.accessToken': 0,
          'user.refreshToken': 0,
        },
      },
    ]);
  }

  async findByUserName(username: string) {
    return await this.Post.aggregate([
      {
        $addFields: {
          location_id_ObjectId: { $toObjectId: '$location_id' },
        },
      },
      {
        $match: { username: username },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: 'locations',
          localField: 'location_id_ObjectId',
          foreignField: '_id',
          as: 'location',
        },
      },
      {
        $unwind: '$location',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'username',
          foreignField: 'username',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          location_id_ObjectId: 0,
          location_id: 0,
          'user._id': 0,
          'user.password': 0,
          'user.accessToken': 0,
          'user.refreshToken': 0,
        },
      },
    ]);
  }

  async updateStatus(postId: string, status: string) {
    await this.Post.findOneAndUpdate(
      { _id: postId },
      { status: status },
      { new: true },
    );
  }
  async countPosts() {
    return await this.Post.countDocuments();
  }

  async createPost(newPost) {
    return await this.Post.create(newPost);
  }

  async updateImagesOfPost(postId: string, urlImage: string[]) {
    await this.Post.updateOne({ _id: postId }, { images: urlImage });
  }

  async delete(postId: string) {
    await this.Post.findByIdAndDelete(postId);
  }
}
