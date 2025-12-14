import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecreationalService } from './recreational.service';
import { RecreationalController } from './recreational.controller';
import { RecreationalFacility } from './entities/recreational-facility.entity';
import { RecreationalBooking } from './entities/recreational-booking.entity';
import { AuthModule } from '../auth-service/auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SeedersModule } from './seeders/seeders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecreationalFacility, RecreationalBooking]),
    AuthModule,
    NotificationsModule,
    SeedersModule,
  ],
  controllers: [RecreationalController],
  providers: [RecreationalService],
  exports: [RecreationalService, SeedersModule],
})
export class RecreationalModule {}
