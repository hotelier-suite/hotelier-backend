import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { DecimalTransformer } from '@app/contracts/common';
import { EventBooking } from '../../events';

@Entity('venues')
export class Venue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @Column('decimal', {
    precision: 8,
    scale: 2,
    transformer: DecimalTransformer,
  })
  area: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: DecimalTransformer,
  })
  hourlyRate: number;

  @Column({ default: true })
  available: boolean;

  @Column()
  location: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => EventBooking, (event) => event.venue, { cascade: true })
  events: EventBooking[];
}
