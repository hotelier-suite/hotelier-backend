import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { MenuItem, RoomServiceOrder, BeverageInventory } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuItem, RoomServiceOrder, BeverageInventory]),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}
