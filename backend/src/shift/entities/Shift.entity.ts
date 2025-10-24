import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { LocationEntity } from 'src/location/entities/location.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
}
export const ShiftSchema = SchemaFactory.createForClass(Shift);
