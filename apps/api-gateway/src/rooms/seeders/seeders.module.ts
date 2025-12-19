import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { RoomsSeeder } from './domains/rooms.seeder';
import { Room } from '../entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  providers: [SeedersService, RoomsSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
