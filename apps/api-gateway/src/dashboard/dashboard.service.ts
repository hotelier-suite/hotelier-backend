import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';
import { DashboardWidget } from './entities/dashboard-widget.entity';
import { CreateDashboardWidgetDto } from './dto/create-dashboard-widget.dto';
import { UpdateDashboardWidgetDto } from './dto/update-dashboard-widget.dto';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
import { RecentActivityDto } from './dto/recent-activity.dto';
import { RevenueDataDto } from './dto/revenue-data.dto';
import { OccupancyDataDto } from './dto/occupancy-data.dto';
import { TopPerformingRoomDto } from './dto/top-performing-room.dto';
import { AuthService } from '../auth-service/auth/auth.service';
import { Room } from '../rooms/entities/room.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { Employee } from '../employees/entities/employee.entity';
import { Invoice } from '../billing/entities/invoice.entity';
import { GuestRequest } from '../guest-requests/entities/guest-request.entity';
import { CleaningAssignment } from '../housekeeping/entities/cleaning-assignment.entity';
import { StaffStatus } from '../employees/enums/staff-status.enum';
import { RequestStatus } from '../guest-requests/enums/request-status.enum';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(DashboardWidget)
    private readonly widgetRepository: Repository<DashboardWidget>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(GuestRequest)
    private readonly guestRequestRepository: Repository<GuestRequest>,
    @InjectRepository(CleaningAssignment)
    private readonly cleaningAssignmentRepository: Repository<CleaningAssignment>,
    private readonly authService: AuthService,
  ) {}

  async createWidget(data: CreateDashboardWidgetDto): Promise<DashboardWidget> {
    return this.widgetRepository.save(data);
  }

  async findAllWidgets(): Promise<DashboardWidget[]> {
    return this.widgetRepository.find({
      where: { visible: true },
      order: { position: 'ASC' },
    });
  }

  async findWidget(id: number): Promise<DashboardWidget | null> {
    return this.widgetRepository.findOne({
      where: { id },
    });
  }

  async updateWidget(
    id: number,
    data: UpdateDashboardWidgetDto,
  ): Promise<DashboardWidget> {
    await this.widgetRepository.update(id, data);
    const updated = await this.findWidget(id);
    if (!updated) {
      throw new NotFoundException(`Widget with id ${id} not found`);
    }
    return updated;
  }

  async removeWidget(id: number): Promise<DashboardWidget> {
    const widget = await this.findWidget(id);
    if (!widget) {
      throw new NotFoundException(`Widget with id ${id} not found`);
    }
    await this.widgetRepository.remove(widget);
    return widget;
  }

  getDashboardStats(userId: number): Observable<DashboardStatsDto> {
    return this.authService.validateUser(userId).pipe(
      switchMap(async (user) => {
        if (!user) throw new NotFoundException('User not found');

        // Core metrics
        const [totalRooms, availableRooms, activeStaff, pendingRequests] =
          await Promise.all([
            this.roomRepository.count(),
            this.roomRepository.count({ where: { isAvailable: true } }),
            this.employeeRepository.count({
              where: { status: StaffStatus.ACTIVE },
            }),
            this.guestRequestRepository.count({
              where: { status: RequestStatus.PENDING },
            }),
          ]);
        const occupiedRooms = Math.max(0, totalRooms - availableRooms);

        // Revenue (last 30 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        const revenueRaw = await this.invoiceRepository
          .createQueryBuilder('invoice')
          .select('SUM(invoice.total)', 'total')
          .where('invoice.createdAt BETWEEN :start AND :end', {
            start: startDate,
            end: endDate,
          })
          .getRawOne<{ total: string }>();
        const totalRevenue = parseFloat(revenueRaw?.total || '0') || 0;

        // Today check-ins / check-outs
        const today = new Date();
        const dayStart = new Date(today);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(today);
        dayEnd.setHours(23, 59, 59, 999);
        const [todayCheckIns, todayCheckOuts] = await Promise.all([
          this.reservationRepository.count({
            where: { checkInDate: Between(dayStart, dayEnd) },
          }),
          this.reservationRepository.count({
            where: { checkOutDate: Between(dayStart, dayEnd) },
          }),
        ]);

        return {
          totalRooms,
          occupiedRooms,
          availableRooms,
          totalRevenue,
          todayCheckIns,
          todayCheckOuts,
          pendingRequests,
          activeStaff,
        };
      }),
    );
  }

  async getOccupancyData(): Promise<OccupancyDataDto[]> {
    const totalRooms = await this.roomRepository.count();
    if (totalRooms === 0) {
      const today = new Date();
      return Array.from({ length: 7 }).map((_, idx) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - idx));
        return { date: d.toISOString().split('T')[0], occupancy: 0 };
      });
    }

    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 6);

    const results: OccupancyDataDto[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);

      // Count reservations overlapping this day: checkIn <= dayEnd AND checkOut > dayStart
      const overlapping = await this.reservationRepository
        .createQueryBuilder('r')
        .where('r.checkInDate <= :dayEnd', { dayEnd })
        .andWhere('r.checkOutDate > :dayStart', { dayStart })
        .getCount();

      const occupancy = Math.max(
        0,
        Math.min(100, Math.round((overlapping / totalRooms) * 100)),
      );
      results.push({ date: d.toISOString().split('T')[0], occupancy });
    }
    return results;
  }

  getRevenueData(userId: number): Observable<RevenueDataDto[]> {
    return this.authService.validateUser(userId).pipe(
      switchMap(async (user) => {
        if (!user) throw new NotFoundException('User not found');

        const today = new Date();
        const start = new Date(today);
        start.setDate(start.getDate() - 6);
        const invoices = await this.invoiceRepository.find({
          where: { createdAt: MoreThanOrEqual(start) },
        });
        const byDate: Record<string, number> = {};
        for (const inv of invoices) {
          const key = inv.createdAt.toISOString().split('T')[0];
          byDate[key] = (byDate[key] || 0) + Number(inv.total);
        }
        return Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          const key = d.toISOString().split('T')[0];
          return { date: key, revenue: byDate[key] || 0 };
        });
      }),
    );
  }

  async getTopPerformingRooms(): Promise<TopPerformingRoomDto[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    const reservations = await this.reservationRepository.find({
      where: { createdAt: Between(startDate, endDate) },
      relations: { room: true },
    });
    const byRoom: Record<string, { revenue: number; nights: number }> = {};
    for (const r of reservations) {
      const roomNum = r.room?.number ?? String(r.roomId);
      if (!byRoom[roomNum]) byRoom[roomNum] = { revenue: 0, nights: 0 };
      byRoom[roomNum].revenue += Number(r.totalAmount || 0);
      byRoom[roomNum].nights += Number(r.nights || 0);
    }
    const items = Object.entries(byRoom)
      .map(([room, v]) => ({
        room,
        revenue: Math.round(v.revenue * 100) / 100,
        occupancy: Math.max(
          0,
          Math.min(100, Math.round((v.nights / 30) * 100)),
        ),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    return items;
  }

  getRecentActivities(userId: number): Observable<RecentActivityDto[]> {
    return this.authService.validateUser(userId).pipe(
      switchMap(async (user) => {
        if (!user) throw new NotFoundException('User not found');

        const [
          recentReservations,
          recentInvoices,
          recentAssignments,
          recentRequests,
        ] = await Promise.all([
          this.reservationRepository.find({
            order: { createdAt: 'DESC' },
            take: 5,
          }),
          this.invoiceRepository.find({
            order: { createdAt: 'DESC' },
            take: 5,
          }),
          this.cleaningAssignmentRepository.find({
            order: { completedAt: 'DESC' },
            take: 5,
          }),
          this.guestRequestRepository.find({
            order: { createdAt: 'DESC' },
            take: 5,
          }),
        ]);

        const activities: RecentActivityDto[] = [];
        recentReservations.forEach((r) =>
          activities.push({
            type: 'booking',
            description: `Reservation for room ${r.roomId} - ${r.guestName}`,
            timestamp: r.createdAt,
          }),
        );
        recentInvoices.forEach((inv) =>
          activities.push({
            type: 'payment',
            description: `Invoice #${inv.number} created`,
            timestamp: inv.createdAt,
          }),
        );
        recentAssignments.forEach((a) =>
          activities.push({
            type: 'maintenance',
            description: `Cleaning assignment ${a.id} ${
              a.completedAt ? 'completed' : 'in progress'
            }`,
            timestamp: a.completedAt || a.assignedDate,
          }),
        );
        recentRequests.forEach((gr) =>
          activities.push({
            type: 'request',
            description: `Guest request ${gr.type} in room ${gr.room}`,
            timestamp: gr.createdAt,
          }),
        );

        return activities
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 12);
      }),
    );
  }
}
