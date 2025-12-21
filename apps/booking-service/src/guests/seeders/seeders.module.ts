import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from '../entities/guest.entity';
import { GuestsSeeder } from './guests.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Guest])],
  providers: [GuestsSeeder],
  exports: [GuestsSeeder],
})
export class GuestsSeedersModule {}
