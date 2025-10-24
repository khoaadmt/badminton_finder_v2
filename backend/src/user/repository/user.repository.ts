import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) {}

    async findOneByUsername(username: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { username } });
    }

    async updateUser(user: User, data: Partial<User>): Promise<User> {
        Object.assign(user, data);
        return this.userRepo.save(user);
    }

    async findUserByFacebookType(username: string) {
        return await this.userRepo.findOne({
            where: {
                type: 'FACEBOOK',
                username: username,
            },
        });
    }

    async findUserByGoogleType(username: string) {
        return await this.userRepo.findOne({
            where: {
                type: 'GOOGLE',
                username: username,
            },
        });
    }

    async createUserByFacebookType(username: string, displayName: string) {
        return await this.userRepo.create({
            type: 'FACEBOOK',
            username: username,
            displayName: displayName,
            facebookId: username,
        });
    }
    async createUserByGoogleType(
        username: string,
        displayName: string,
        avaUrl: string,
    ) {
        return await this.userRepo.create({
            type: 'GOOGLE',
            username: username,
            displayName: displayName,
            avaUrl: avaUrl,
        });
    }
    async createUser(user: any) {
        const newUser = this.userRepo.create(user);
        return await this.userRepo.save(newUser);
    }
}
