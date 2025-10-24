import { LocationEntity } from 'src/location/entities/location.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Court {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    courtNumber: number;

    @ManyToOne(() => LocationEntity, (location) => location.courts)
    location: LocationEntity;
}
