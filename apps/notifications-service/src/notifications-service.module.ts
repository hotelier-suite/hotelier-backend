import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database';
import { NotificationsModule } from './notifications';
import { SeedersModule } from './seeders';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    NotificationsModule,
    SeedersModule,
  ],
})
export class NotificationsServiceModule {}
