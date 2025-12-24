import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DASHBOARD_SERVICE_CLIENT } from './constants';
import { DashboardModule } from './dashboard/dashboard.module';

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
    DashboardModule,
  ],
  exports: [ClientsModule, DashboardModule],
})
export class DashboardServiceModule {}
