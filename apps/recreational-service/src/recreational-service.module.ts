import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database';
import { RecreationalModule } from './recreational';
import { SeedersModule } from './seeders';
import { NotificationsServiceModule } from './notifications-service';

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
