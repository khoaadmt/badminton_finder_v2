import { JwtService } from '@nestjs/jwt';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class CheckPermissionMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization.split(' ')[1];

            if (!token) {
                return res.status(403).json({
                    message:
                        'Bạn cần phải đăng nhập để thực hiện hành động này!',
                });
            }

            const decoded = await this.jwtService.verifyAsync(token, {
                secret: process.env.ACCESS_TOKEN_SECRET,
            });

            const user = await this.userRepo.findOne({
                where: {
                    id: decoded.user_id,
                },
            });

            if (!user) {
                return res.status(403).json({
                    message: 'Token lỗi',
                });
            }

            if (user.role !== 'admin') {
                return res.status(403).json({
                    message: 'Bạn không có quyền thực hiện hành động này',
                });
            }

            next();
        } catch (error) {
            res.status(500).json({
                name: error.name,
                message: error.message,
            });
        }
    }
}
