import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BILLING_SERVICE_CLIENT } from './constants';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';
import { StatisticsModule } from './statistics/statistics.module';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: BILLING_SERVICE_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'billing_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    InvoicesModule,
    PaymentsModule,
    StatisticsModule,
  ],
  exports: [ClientsModule, InvoicesModule, PaymentsModule, StatisticsModule],
})
export class BillingServiceModule {}
