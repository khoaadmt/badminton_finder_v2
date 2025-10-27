import { Court } from 'src/court/entities/court.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Shift } from 'src/shift/entities/Shift.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export interface Timeline {
    start: string;
    end: string;
}

@Entity()
export class LocationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    city: string;

    @Column()
    address: string;

    @Column()
    contactPhone: string;

    @Column('text', { array: true })
    img: string[];

    @Column()
    description: string;

    @Column()
    numberOfCourts: number;

    @Column()
    priceMin: number;

    @Column()
    priceMax: number;

    @Column({ type: 'jsonb', nullable: false })
    openHours: Timeline;

    @Column({ type: 'decimal', precision: 10, scale: 7 })
    latitude: number;

    @Column({ type: 'decimal', precision: 10, scale: 7 })
    longitude: number;

    @OneToMany(() => Court, (court) => court.location)
    courts: Court[];

    @OneToMany(() => Shift, (shift) => shift.location)
    shifts: Shift[];

    @OneToMany(() => Post, (post) => post.location)
    posts: Post[];
}
