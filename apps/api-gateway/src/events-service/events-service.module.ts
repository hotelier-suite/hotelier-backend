import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EVENTS_SERVICE_CLIENT } from './constants';
import { EventsModule } from './events/events.module';
import { VenuesModule } from './venues/venues.module';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: EVENTS_SERVICE_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'events_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    EventsModule,
    VenuesModule,
  ],
  exports: [ClientsModule, EventsModule, VenuesModule],
})
export class EventsServiceModule {}
