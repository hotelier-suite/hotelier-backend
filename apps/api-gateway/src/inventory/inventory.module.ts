import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';
import { InventoryMovement } from './entities/inventory-movement.entity';
import { Supplier } from './entities/supplier.entity';
import { SeedersModule } from './seeders/seeders.module';
import { NotificationsModule } from '../notifications-service/notifications/notifications.module';
import { AuthModule } from '../auth-service/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, InventoryMovement, Supplier]),
    SeedersModule,
    NotificationsModule,
    AuthModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService, SeedersModule],
})
export class InventoryModule {}
