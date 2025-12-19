import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RpcException, Transport } from '@nestjs/microservices';
import { ValidationError } from 'class-validator';
import { NotificationsServiceModule } from './notifications-service.module';
import { SeedersService } from './seeders/seeders.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(NotificationsServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672'],
      queue: 'notifications_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors
          .flatMap((error) => Object.values(error.constraints ?? {}))
          .filter((message) => typeof message === 'string');

        return new RpcException({
          statusCode: 400,
          message:
            messages.length > 0 ? messages.join(', ') : 'Validation failed',
        });
      },
    }),
  );

  const seeders = app.get(SeedersService);
  seeders.seed();

  await app.listen();
}

void bootstrap();
