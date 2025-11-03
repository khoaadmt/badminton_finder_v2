import { LocationEntity } from 'src/location/entities/location.entity';
import { User } from 'src/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    memberCount: number;

    @Column({ type: 'timestamp' })
    startTime: Date;

    @Column()
    gender: number;

    @Column('text', { array: true })
    phones: string[];

    @Column('text', {
        array: true,
        default: [
            'http://localhost:5000/api/uploads/post/default-post-images.jpg',
        ],
    })
    images: string[];

    @Column()
    levelMemberMin: number;

    @Column()
    levelMemberMax: number;

    @Column()
    priceMin: number;

    @Column()
    priceMax: number;

    @Column()
    agreement: boolean;

    @Column()
    username: string;

    @Column({ default: 'pending' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => LocationEntity, (location) => location.posts)
    location: LocationEntity;

    @ManyToOne(() => User, (user) => user.posts)
    user: User;
}
