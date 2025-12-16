import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ParkingServiceModule } from './parking-service.module';
import { SeedersService } from './seeders/seeders.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ParkingServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672'],
      queue: 'parking_queue',
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
