import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Report } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]),
    ClientsModule.register([
      {
        name: 'BILLING_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'billing_queue',
          queueOptions: { durable: true },
        },
      },
      {
        name: 'BOOKING_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'booking_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
