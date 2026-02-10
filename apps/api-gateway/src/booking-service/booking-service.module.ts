import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BOOKING_SERVICE_CLIENT } from './constants';
import { RoomsModule } from './rooms';
import { GuestsModule } from './guests';
import { ReservationsModule } from './reservations';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: BOOKING_SERVICE_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'booking_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    RoomsModule,
    GuestsModule,
    ReservationsModule,
  ],
  exports: [ClientsModule, RoomsModule, GuestsModule, ReservationsModule],
})
export class BookingServiceModule {}
