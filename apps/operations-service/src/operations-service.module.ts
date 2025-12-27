import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database';
import { CleaningTasksModule } from './cleaning-tasks';
import { CleaningAssignmentsModule } from './cleaning-assignments';
import { MaintenanceReportsModule } from './maintenance-reports';
import { MaintenanceRequestsModule } from './maintenance-requests';
import { StatisticsModule } from './statistics';
import { MaintenanceModule } from './maintenance';
import { SeedersModule } from './seeders';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    CleaningTasksModule,
    CleaningAssignmentsModule,
    MaintenanceReportsModule,
    MaintenanceRequestsModule,
    StatisticsModule,
    MaintenanceModule,
    SeedersModule,
  ],
})
export class OperationsServiceModule {}
