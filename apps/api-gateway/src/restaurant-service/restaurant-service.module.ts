import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RESTAURANT_SERVICE_CLIENT } from './constants';
import { MenuItemsModule } from './menu-items';
import { RoomServiceOrdersModule } from './room-service-orders';
import { BeverageInventoryModule } from './beverage-inventory';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: RESTAURANT_SERVICE_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'restaurant_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    MenuItemsModule,
    RoomServiceOrdersModule,
    BeverageInventoryModule,
  ],
  exports: [
    ClientsModule,
    MenuItemsModule,
    RoomServiceOrdersModule,
    BeverageInventoryModule,
  ],
})
export class RestaurantServiceModule {}
