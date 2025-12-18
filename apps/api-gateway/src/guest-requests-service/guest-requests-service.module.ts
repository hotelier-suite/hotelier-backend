import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GUEST_REQUESTS_SERVICE_CLIENT } from './constants';
import { GuestRequestsModule } from './guest-requests/guest-requests.module';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: GUEST_REQUESTS_SERVICE_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'guest_requests_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    GuestRequestsModule,
  ],
  exports: [ClientsModule],
})
export class GuestRequestsServiceModule {}
