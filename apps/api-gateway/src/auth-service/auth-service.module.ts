import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
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
    RolesModule,
    UsersModule,
  ],
  exports: [ClientsModule],
})
export class AuthServiceModule {}
