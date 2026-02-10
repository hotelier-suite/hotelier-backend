import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DASHBOARD_SERVICE_CLIENT } from './constants';
import { WidgetsModule } from './widgets';
import { StatisticsModule } from './statistics';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: DASHBOARD_SERVICE_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'dashboard_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    WidgetsModule,
    StatisticsModule,
  ],
  exports: [ClientsModule, WidgetsModule, StatisticsModule],
})
export class DashboardServiceModule {}
