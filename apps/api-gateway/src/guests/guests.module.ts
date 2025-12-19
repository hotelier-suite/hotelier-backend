import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { Guest } from '../reservations/entities/guest.entity';
import { AuthModule } from '../auth-service/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Guest]), AuthModule],
  controllers: [GuestsController],
  providers: [GuestsService],
  exports: [GuestsService],
})
export class GuestsModule {}
