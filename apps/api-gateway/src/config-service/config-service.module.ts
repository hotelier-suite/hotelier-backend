import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CONFIG_SERVICE_CLIENT } from './constants';
import { ConfigurationModule } from './configuration/configuration.module';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: CONFIG_SERVICE_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'config_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    ConfigurationModule,
  ],
  exports: [ClientsModule],
})
export class ConfigServiceModule {}
