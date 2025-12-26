import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BILLING_SERVICE_CLIENT } from './constants';
import { InvoicesModule } from './invoices';
import { PaymentsModule } from './payments';
import { StatisticsModule } from './statistics';

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
    StatisticsModule,
    InvoicesModule,
    PaymentsModule,
  ],
  exports: [ClientsModule, StatisticsModule, InvoicesModule, PaymentsModule],
})
export class BillingServiceModule {}
