import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { MenuItem } from './entities/menu-item.entity';
import { RoomServiceOrder } from './entities/room-service-order.entity';
import { BeverageInventory } from './entities/beverage-inventory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuItem, RoomServiceOrder, BeverageInventory]),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}
