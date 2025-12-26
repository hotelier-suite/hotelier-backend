import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSpace } from './entities';
import { SpacesController } from './spaces.controller';
import { SpacesService } from './spaces.service';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingSpace])],
  controllers: [SpacesController],
  providers: [SpacesService],
})
export class SpacesModule {}
