import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  );

  // Configure CORS - Allow all origins (DEVELOPMENT ONLY)
  app.enableCors({
    origin: true, // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
    exposedHeaders: ['Authorization'],
  });

  const isDevelopment = process.env.NODE_ENV !== 'production';

  const config = new DocumentBuilder()
    .setTitle('Hotelier API Backend')
    .setDescription('API Documentation for Hotelier Management System')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for later reference
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Configure Swagger setup options
  const swaggerOptions = {
    swaggerOptions: {
      persistAuthorization: true, // Keep authorization data on page refresh
      displayRequestDuration: true,
    },
    customSiteTitle: 'Hotelier API Documentation',
  };

  if (isDevelopment) {
    // In development: Swagger is accessible without authentication
    SwaggerModule.setup('api', app, document, swaggerOptions);
  } else {
    // In production: Swagger requires authentication
    SwaggerModule.setup('api', app, document, {
      ...swaggerOptions,
      customCss: '.swagger-ui .topbar { display: none }', // Hide top bar in production
    });
  }

  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
