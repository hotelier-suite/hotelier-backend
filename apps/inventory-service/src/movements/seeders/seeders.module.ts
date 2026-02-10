import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryMovement } from '../entities';
import { InventoryItem } from '../../items/entities/inventory-item.entity';
import { MovementsSeeder } from './movements.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryMovement, InventoryItem])],
  providers: [MovementsSeeder],
  exports: [MovementsSeeder],
})
export class MovementsSeedersModule {}
