import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { DecimalTransformer } from '@app/contracts/common';
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

  @BeforeInsert()
  generateItemCode(): void {
    if (!this.itemCode) {
      this.itemCode = `BEV${Date.now().toString(36).toUpperCase()}`;
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  calculateStatus(): void {
    if (this.stock === 0) {
      this.status = BeverageStatus.OUT_OF_STOCK;
    } else if (this.stock <= this.minimumStock) {
      this.status = BeverageStatus.LOW_STOCK;
    } else {
      this.status = BeverageStatus.AVAILABLE;
    }
  }
}
