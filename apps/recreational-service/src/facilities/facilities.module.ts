import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacilitiesController } from './facilities.controller';
import { FacilitiesService } from './facilities.service';
import { RecreationalFacility } from './entities';
import { RecreationalBooking } from '../bookings/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecreationalFacility, RecreationalBooking]),
  ],
  controllers: [FacilitiesController],
  providers: [FacilitiesService],
  exports: [FacilitiesService, TypeOrmModule],
})
export class FacilitiesModule {}
