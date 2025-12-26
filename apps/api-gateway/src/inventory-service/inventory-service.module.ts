import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { INVENTORY_SERVICE_CLIENT } from './constants';
import { ItemsModule } from './items';
import { SuppliersModule } from './suppliers';
import { MovementsModule } from './movements';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: INVENTORY_SERVICE_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'inventory_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    ItemsModule,
    SuppliersModule,
    MovementsModule,
  ],
  exports: [ClientsModule],
})
export class InventoryServiceModule {}
