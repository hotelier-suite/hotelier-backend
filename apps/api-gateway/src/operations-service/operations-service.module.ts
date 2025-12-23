import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OPERATIONS_SERVICE_CLIENT } from './constants';
import { HousekeepingModule } from './housekeeping/housekeeping.module';
import { MaintenanceModule } from './maintenance/maintenance.module';

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
    HousekeepingModule,
    MaintenanceModule,
  ],
  exports: [ClientsModule, HousekeepingModule, MaintenanceModule],
})
export class OperationsServiceModule {}
