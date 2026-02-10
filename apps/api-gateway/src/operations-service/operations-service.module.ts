import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OPERATIONS_SERVICE_CLIENT } from './constants';
import { CleaningTasksModule } from './cleaning-tasks';
import { CleaningAssignmentsModule } from './cleaning-assignments';
import { MaintenanceReportsModule } from './maintenance-reports';
import { MaintenanceRequestsModule } from './maintenance-requests/maintenance-requests.module';
import { StatisticsModule } from './statistics';
import { MaintenanceModule } from './maintenance';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: OPERATIONS_SERVICE_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'operations_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    CleaningTasksModule,
    CleaningAssignmentsModule,
    MaintenanceReportsModule,
    MaintenanceRequestsModule,
    StatisticsModule,
    MaintenanceModule,
  ],
  exports: [
    ClientsModule,
    CleaningTasksModule,
    CleaningAssignmentsModule,
    MaintenanceReportsModule,
    MaintenanceRequestsModule,
    StatisticsModule,
    MaintenanceModule,
  ],
})
export class OperationsServiceModule {}
