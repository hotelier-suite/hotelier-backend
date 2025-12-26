import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PARKING_SERVICE_CLIENT } from './constants';
import { VehiclesModule } from './vehicles';
import { SpacesModule } from './spaces';
import { IncidentsModule } from './incidents';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: PARKING_SERVICE_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'parking_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    VehiclesModule,
    SpacesModule,
    IncidentsModule,
  ],
  exports: [ClientsModule],
})
export class ParkingServiceModule {}
