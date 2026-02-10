import { Module } from '@nestjs/common';
import { BeverageInventoryController } from './beverage-inventory.controller';
import { BeverageInventoryService } from './beverage-inventory.service';

@Module({
  controllers: [BeverageInventoryController],
  providers: [BeverageInventoryService],
  exports: [BeverageInventoryService],
})
export class BeverageInventoryModule {}
