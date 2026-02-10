import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BeverageInventoryController } from './beverage-inventory.controller';
import { BeverageInventoryService } from './beverage-inventory.service';
import { BeverageInventory } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([BeverageInventory])],
  controllers: [BeverageInventoryController],
  providers: [BeverageInventoryService],
  exports: [BeverageInventoryService],
})
export class BeverageInventoryModule {}
