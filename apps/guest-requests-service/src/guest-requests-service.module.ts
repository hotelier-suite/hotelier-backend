import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { GuestRequestsModule } from './guest-requests/guest-requests.module';
import { SeedersModule } from './seeders/seeders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    GuestRequestsModule,
    SeedersModule,
  ],
})
export class GuestRequestsServiceModule {}
