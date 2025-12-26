import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RECREATIONAL_SERVICE_CLIENT } from './constants';
import { FacilitiesModule } from './facilities';
import { BookingsModule } from './bookings';
import { AvailabilityModule } from './availability';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: RECREATIONAL_SERVICE_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'recreational_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    FacilitiesModule,
    BookingsModule,
    AvailabilityModule,
  ],
  exports: [ClientsModule, FacilitiesModule, BookingsModule],
})
export class RecreationalServiceModule {}
