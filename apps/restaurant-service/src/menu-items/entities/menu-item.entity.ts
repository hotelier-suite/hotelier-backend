import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import type { InsertEvent } from 'typeorm';
import { DecimalTransformer } from '@app/contracts/common';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  itemCode: string;

  @Column()
  category: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: DecimalTransformer,
  })
  price: number;

  @Column({ default: true })
  available: boolean;

  @Column({ nullable: true })
  preparationTime?: string;

  @Column('json', { nullable: true })
  ingredients?: string[];

  @Column('json', { nullable: true })
  allergens?: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async generateItemCode(event: InsertEvent<MenuItem>): Promise<void> {
    if (!this.itemCode) {
      const count = await event.manager.count(MenuItem);
      this.itemCode = `MENU${String(count + 1).padStart(3, '0')}`;
    }
  }
}
