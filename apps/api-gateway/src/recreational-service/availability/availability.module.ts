import { Module } from '@nestjs/common';
import { AvailabilityController } from './availability.controller';
import { FacilitiesModule } from '../facilities';

@Module({
  imports: [FacilitiesModule],
  controllers: [AvailabilityController],
})
export class AvailabilityModule {}
