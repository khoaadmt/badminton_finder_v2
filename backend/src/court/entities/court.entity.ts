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
export class Court {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    courtNumber: number;

    @ManyToOne(() => LocationEntity, (location) => location.courts)
    location: LocationEntity;

    @OneToMany(() => Booking, (booking) => booking.court)
    bookings: Booking[];
}
