import { Booking } from 'src/booking/entities/booking.entity';
import { Post } from 'src/posts/entities/post.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('app_user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'LOCAL' })
    type: string;

    @Column()
    displayName: string;

    @Column()
    username: string;

    @Column({ default: '' })
    password: string;

    @Column({
        default:
            'https://jskadysbdihpzhmaaccv.supabase.co/storage/v1/object/public/image/default-avatar.jpg',
    })
    avaUrl: string;

    @Column({ default: '' })
    contactPhone: string;

    @Column({ default: '' })
    facebookId: string;

    @Column({ default: 'refresh_token' })
    refreshToken: string;

    @Column({ default: 'access_token' })
    accessToken: string;

    @Column({ default: 'member' })
    role: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Booking, (booking) => booking.user)
    bookings: Booking[];
}
