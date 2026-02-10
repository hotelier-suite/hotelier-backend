import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUDIT_SERVICE_CLIENT } from './constants';
import { AUTH_SERVICE_CLIENT } from '../auth-service/constants';
import { AuditModule, AuditLogInterceptor } from './audit';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUDIT_SERVICE_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'audit_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
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
    AuditModule,
  ],
  providers: [AuditLogInterceptor],
  exports: [ClientsModule, AuditModule, AuditLogInterceptor],
})
export class AuditServiceModule {}
