import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DecimalTransformer } from '../../database';
import { BeverageStatus } from '@app/contracts/restaurant-service';

@Entity('beverage_inventory')
export class BeverageInventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  itemCode: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 0 })
  minimumStock: number;

  @Column()
  unit: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: DecimalTransformer,
  })
  unitCost: number;

  @Column({ nullable: true })
  supplier?: string;

  @Column({ type: 'timestamp', nullable: true })
  lastPurchase?: Date;

  @Column({
    type: 'enum',
    enum: BeverageStatus,
    default: BeverageStatus.AVAILABLE,
  })
  status: BeverageStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
