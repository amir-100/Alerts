import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  //   Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { flip } from '@turf/turf';
import { Polygon } from '../../types';

@Entity('cities')
export class City extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //   @Index({ spatial: true })
  @Column({ type: 'geometry', srid: 4326 })
  shape: Polygon;

  @Column({ length: 50, unique: true })
  name: string;

  @AfterLoad()
  flipPoints() {
    this.shape = flip(this.shape);
  }
}
