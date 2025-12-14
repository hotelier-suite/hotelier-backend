import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DashboardWidget } from './entities/dashboard-widget.entity';
import { AuthModule } from '../auth-service/auth/auth.module';
import { Room } from '../rooms/entities/room.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { Employee } from '../employees/entities/employee.entity';
import { Invoice } from '../billing/entities/invoice.entity';
import { GuestRequest } from '../guest-requests/entities/guest-request.entity';
import { CleaningAssignment } from '../housekeeping/entities/cleaning-assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DashboardWidget,
      Room,
      Reservation,
      Employee,
      Invoice,
      GuestRequest,
      CleaningAssignment,
    ]),
    AuthModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
