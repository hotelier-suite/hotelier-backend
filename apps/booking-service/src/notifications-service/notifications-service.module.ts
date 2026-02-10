import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE_CLIENT } from './constants';
import { NotificationsModule } from './notifications';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: NOTIFICATIONS_SERVICE_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'notifications_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    NotificationsModule,
  ],
  exports: [ClientsModule, NotificationsModule],
})
export class NotificationsServiceModule {}
