import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenuesService } from './venues.service';
import { VenuesController } from './venues.controller';
import { Venue } from './entities/venue.entity';
import { SeedersModule } from './seeders/seeders.module';

@Module({
  imports: [TypeOrmModule.forFeature([Venue]), SeedersModule],
  controllers: [VenuesController],
  providers: [VenuesService],
  exports: [VenuesService, SeedersModule],
})
export class VenuesModule {}
