import { Booking } from 'src/booking/entities/booking.entity';
import { LocationEntity } from 'src/location/entities/location.entity';
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Shift {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    shiftNumber: number;

    @Column()
    startTime: string;

    @Column()
    endTime: string;

    @Column()
    period: string;

    @Column()
    price: number;

    @ManyToOne(() => LocationEntity, (location) => location.shifts)
    location: LocationEntity;

    @OneToMany(() => Booking, (booking) => booking.shift)
    bookings: Booking[];
}
