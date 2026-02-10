import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import type { InsertEvent } from 'typeorm';
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
  async generateItemCode(event: InsertEvent<BeverageInventory>): Promise<void> {
    if (!this.itemCode) {
      const count = await event.manager.count(BeverageInventory);
      this.itemCode = `BEV${String(count + 1).padStart(3, '0')}`;
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
