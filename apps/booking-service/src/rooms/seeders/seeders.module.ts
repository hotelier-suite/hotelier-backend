import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
import { RoomsSeeder } from './rooms.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  providers: [RoomsSeeder],
  exports: [RoomsSeeder],
})
export class RoomsSeedersModule {}
