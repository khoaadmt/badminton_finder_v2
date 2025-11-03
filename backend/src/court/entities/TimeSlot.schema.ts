import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Court } from './court.entity';

@Entity()
export class TimeSlot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    startTime: string;

    @Column()
    endTime: string;

    @Column()
    period: string;

    @Column()
    price: number;

    @ManyToOne(() => Court, (court) => court.location)
    courts: Court;
}
