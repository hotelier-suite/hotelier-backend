import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from './entities/room.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { AuthModule } from '../auth-service/auth/auth.module';
import { SeedersModule } from './seeders/seeders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, Reservation]),
    AuthModule,
    SeedersModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService, SeedersModule],
})
export class RoomsModule {}
