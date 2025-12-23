import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RecreationalModule } from './recreational/recreational.module';
import { SeedersModule } from './seeders/seeders.module';
import { NotificationsServiceModule } from './notifications-service/notifications-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    NotificationsServiceModule,
    RecreationalModule,
    SeedersModule,
  ],
})
export class RecreationalServiceModule {}
