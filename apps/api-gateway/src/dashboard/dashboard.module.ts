import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DashboardWidget } from './entities/dashboard-widget.entity';
import { AuthModule } from '../auth-service/auth/auth.module';
import { Room } from '../rooms/entities/room.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { Invoice } from '../billing/entities/invoice.entity';
import { CleaningAssignment } from '../housekeeping/entities/cleaning-assignment.entity';
import { GuestRequestsModule } from '../guest-requests-service/guest-requests/guest-requests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DashboardWidget,
      Room,
      Reservation,
      Invoice,
      CleaningAssignment,
    ]),
    AuthModule,
    GuestRequestsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
