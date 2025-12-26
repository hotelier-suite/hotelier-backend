import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth';
import { PermissionsModule } from './permissions';
import { RolesModule } from './roles';
import { UsersModule } from './users';
import { AUTH_SERVICE_CLIENT } from './constants';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICE_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'auth_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    AuthModule,
    PermissionsModule,
    RolesModule,
    UsersModule,
  ],
  exports: [ClientsModule],
})
export class AuthServiceModule {}
