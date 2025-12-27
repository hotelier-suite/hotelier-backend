import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database';
import { MenuItemsModule } from './menu-items';
import { RoomServiceOrdersModule } from './room-service-orders';
import { BeverageInventoryModule } from './beverage-inventory';
import { SeedersModule } from './seeders';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    MenuItemsModule,
    RoomServiceOrdersModule,
    BeverageInventoryModule,
    SeedersModule,
  ],
})
export class RestaurantServiceModule {}
