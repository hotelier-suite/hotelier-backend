import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecreationalController } from './recreational.controller';
import { RecreationalService } from './recreational.service';
import { RecreationalFacility } from './entities/recreational-facility.entity';
import { RecreationalBooking } from './entities/recreational-booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecreationalFacility, RecreationalBooking]),
  ],
  controllers: [RecreationalController],
  providers: [RecreationalService],
  exports: [RecreationalService],
})
export class RecreationalModule {}
