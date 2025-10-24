import { Body, Controller, Param, Put } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.Dto';
import { UserService } from './services/user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Put(':username')
    async updateUser(
        @Param('username') username: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        const updatedUser = await this.userService.updateUser(
            username,
            updateUserDto,
        );
        return {
            statusCode: 200,
            message: 'Update user success',
            data: {
                user: updatedUser,
            },
        };
    }
}
