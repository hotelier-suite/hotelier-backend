import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HousekeepingService } from './housekeeping.service';
import { HousekeepingController } from './housekeeping.controller';
import { MaintenanceReport } from './entities/maintenance-report.entity';
import { CleaningAssignment } from './entities/cleaning-assignment.entity';
import { CleaningTask } from './entities/cleaning-task.entity';
import { MaintenanceRequest } from './entities/maintenance-request.entity';
import { Room } from '../rooms/entities/room.entity';
import { AuthModule } from '../auth-service/auth/auth.module';
import { SeedersModule } from './seeders/seeders.module';
import { NotificationsModule } from '../notifications-service/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MaintenanceReport,
      CleaningAssignment,
      CleaningTask,
      MaintenanceRequest,
      Room,
    ]),
    AuthModule,
    SeedersModule,
    NotificationsModule,
  ],
  controllers: [HousekeepingController],
  providers: [HousekeepingService],
  exports: [HousekeepingService, SeedersModule],
})
export class HousekeepingModule {}
