import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { GuestRequestsServiceModule } from './guest-requests-service.module';
import { SeedersService } from './seeders';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(GuestRequestsServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672'],
      queue: 'guest_requests_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  const seeders = app.get(SeedersService);
  await seeders.seed();

  await app.listen();
}

void bootstrap();
