import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { REPORTS_SERVICE_CLIENT } from './constants';
import { ReportsModule } from './reports/reports.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: REPORTS_SERVICE_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'reports_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    ReportsModule,
    AnalyticsModule,
  ],
  exports: [ClientsModule, ReportsModule, AnalyticsModule],
})
export class ReportsServiceModule {}
