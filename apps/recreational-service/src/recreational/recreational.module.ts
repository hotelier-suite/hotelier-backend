import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecreationalController } from './recreational.controller';
import { RecreationalService } from './recreational.service';
import { RecreationalFacility, RecreationalBooking } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecreationalFacility, RecreationalBooking]),
  ],
  controllers: [RecreationalController],
  providers: [RecreationalService],
  exports: [RecreationalService],
})
export class RecreationalModule {}
