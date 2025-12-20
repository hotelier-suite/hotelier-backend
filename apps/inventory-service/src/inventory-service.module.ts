import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ItemsModule } from './items/items.module';
import { MovementsModule } from './movements/movements.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { SeedersModule } from './seeders/seeders.module';
import { NotificationsServiceModule } from './notifications-service/notifications-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    NotificationsServiceModule,
    ItemsModule,
    MovementsModule,
    SuppliersModule,
    SeedersModule,
  ],
})
export class InventoryServiceModule {}
