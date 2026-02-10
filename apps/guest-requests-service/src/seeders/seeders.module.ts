import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { GuestRequestsSeedersModule } from '../guest-requests';

@Module({
  imports: [GuestRequestsSeedersModule],
  providers: [SeedersService],
  exports: [SeedersService],
})
export class SeedersModule {}
