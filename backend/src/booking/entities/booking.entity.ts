import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Court } from 'src/court/entities/court.entity';
import { LocationEntity } from 'src/location/entities/location.entity';
import { Shift } from 'src/shift/entities/Shift.entity';
import { User } from 'src/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'Pending' })
    status: string;

    @Column({ type: 'timestamp' })
    date: Date;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    username: string;

    @ManyToOne(() => User, (user) => user.bookings)
    user: User;

    @Column()
    courtId: number;

    @ManyToOne(() => Court, (court) => court.bookings)
    court: Court;

    @Column()
    shiftId: number;

    @ManyToOne(() => Shift, (shift) => shift.bookings)
    shift: Shift;

    @Column()
    locationId: number;

    @ManyToOne(() => LocationEntity, (location) => location.bookings)
    location: LocationEntity;
}
