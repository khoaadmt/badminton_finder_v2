import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.Dto';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async updateUser(username: string, updateUserDto: UpdateUserDto) {
        const existingUser =
            await this.userRepository.findOneByUsername(username);
        if (!existingUser) {
            throw new NotFoundException('User not found');
        }
        try {
            return await this.userRepository.updateUser(
                existingUser,
                updateUserDto,
            );
        } catch (err) {
            throw new HttpException('Update error', HttpStatus.BAD_REQUEST);
        }
    }
}
