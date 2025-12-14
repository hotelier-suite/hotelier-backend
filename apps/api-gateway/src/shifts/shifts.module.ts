import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftsController } from './shifts.controller';
import { ShiftsService } from './shifts.service';
import { Shift } from './entities/shift.entity';
import { Employee } from '../employees/entities/employee.entity';
import { SeedersModule } from './seeders/seeders.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shift, Employee]),
    SeedersModule,
    NotificationsModule,
  ],
  controllers: [ShiftsController],
  providers: [ShiftsService],
  exports: [ShiftsService, SeedersModule],
})
export class ShiftsModule {}
