import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { RoomServiceOrder } from './entities/room-service-order.entity';
import { MenuItem } from './entities/menu-item.entity';
import { BeverageInventory } from './entities/beverage-inventory.entity';
import { AuthModule } from '../auth-service/auth/auth.module';
import { SeedersModule } from './seeders/seeders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomServiceOrder, MenuItem, BeverageInventory]),
    AuthModule,
    SeedersModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService, SeedersModule],
})
export class RestaurantModule {}
