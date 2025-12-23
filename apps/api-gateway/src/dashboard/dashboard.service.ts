import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardWidget } from './entities/dashboard-widget.entity';
import { CreateDashboardWidgetDto } from './dto/create-dashboard-widget.dto';
import { UpdateDashboardWidgetDto } from './dto/update-dashboard-widget.dto';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
import { RecentActivityDto } from './dto/recent-activity.dto';
import { RevenueDataDto } from './dto/revenue-data.dto';
import { OccupancyDataDto } from './dto/occupancy-data.dto';
import { TopPerformingRoomDto } from './dto/top-performing-room.dto';
import { AuthService } from '../auth-service/auth/auth.service';
import { RoomsService } from '../booking-service/rooms/rooms.service';
import { ReservationsService } from '../booking-service/reservations/reservations.service';
import { InvoicesService } from '../billing-service/invoices/invoices.service';
import { StatisticsService } from '../billing-service/statistics/statistics.service';
import { HousekeepingService } from '../operations-service/housekeeping/housekeeping.service';
import { RequestStatus } from '@app/contracts/guest-requests-service/guest-requests/enums/request-status.enum';
import { GuestRequestsService } from '../guest-requests-service/guest-requests/guest-requests.service';
import { EmployeesService } from '../staff-service/employees/employees.service';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { RoomDto } from '@app/contracts/booking-service/rooms/dto/room.dto';
import { ReservationDto } from '@app/contracts/booking-service/reservations/dto/reservation.dto';
import { InvoiceDto } from '@app/contracts/billing-service/invoices/dto';
import { CleaningAssignmentDto } from '@app/contracts/operations-service/housekeeping/dto';
import { GuestRequestDto } from '@app/contracts/guest-requests-service/guest-requests/dto/guest-request.dto';
import { DepartmentStatsDto } from '@app/contracts/staff-service/employees/dto/department-stats.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(DashboardWidget)
    private readonly widgetRepository: Repository<DashboardWidget>,
    private readonly roomsService: RoomsService,
    private readonly reservationsService: ReservationsService,
    private readonly invoicesService: InvoicesService,
    private readonly statisticsService: StatisticsService,
    private readonly housekeepingService: HousekeepingService,
    private readonly employeesService: EmployeesService,
    private readonly guestRequestsService: GuestRequestsService,
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
      switchMap((user) => {
        if (!user) {
          throw new NotFoundException('User not found');
        }

        // Get date range for last 30 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);

        // Today's date range
        const today = new Date();
        const dayStart = new Date(today);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(today);
        dayEnd.setHours(23, 59, 59, 999);

        return forkJoin({
          rooms: this.roomsService
            .findAll()
            .pipe(catchError(() => of([] as RoomDto[]))),
          reservations: this.reservationsService
            .findAll()
            .pipe(catchError(() => of([] as ReservationDto[]))),
          financialSummary: this.statisticsService
            .getFinancialSummary(startDate.toISOString(), endDate.toISOString())
            .pipe(catchError(() => of({ totalRevenue: 0 }))),
          activeStaff: this.employeesService.getDepartmentStats().pipe(
            map((stats: DepartmentStatsDto[]) =>
              stats.reduce((sum, s) => sum + (s.activeCount ?? 0), 0),
            ),
            catchError(() => of(0)),
          ),
          pendingRequests: this.guestRequestsService
            .countByStatus(RequestStatus.PENDING)
            .pipe(catchError(() => of(0))),
        }).pipe(
          map(
            ({
              rooms,
              reservations,
              financialSummary,
              activeStaff,
              pendingRequests,
            }) => {
              const totalRooms = rooms.length;
              const availableRooms = rooms.filter((r) => r.isAvailable).length;

              // Count today's check-ins and check-outs
              const todayCheckIns = reservations.filter((r) => {
                const checkIn = new Date(r.checkInDate);
                return checkIn >= dayStart && checkIn <= dayEnd;
              }).length;

              const todayCheckOuts = reservations.filter((r) => {
                const checkOut = new Date(r.checkOutDate);
                return checkOut >= dayStart && checkOut <= dayEnd;
              }).length;

              return {
                totalRooms,
                occupiedRooms: Math.max(0, totalRooms - availableRooms),
                availableRooms,
                totalRevenue: financialSummary.totalRevenue || 0,
                todayCheckIns,
                todayCheckOuts,
                pendingRequests,
                activeStaff,
              };
            },
          ),
        );
      }),
    );
  }

  getOccupancyData(): Observable<OccupancyDataDto[]> {
    return forkJoin({
      rooms: this.roomsService
        .findAll()
        .pipe(catchError(() => of([] as RoomDto[]))),
      reservations: this.reservationsService
        .findAll()
        .pipe(catchError(() => of([] as ReservationDto[]))),
    }).pipe(
      map(({ rooms, reservations }) => {
        const totalRooms = rooms.length;
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
          const overlapping = reservations.filter((r) => {
            const checkIn = new Date(r.checkInDate);
            const checkOut = new Date(r.checkOutDate);
            return checkIn <= dayEnd && checkOut > dayStart;
          }).length;

          const occupancy = Math.max(
            0,
            Math.min(100, Math.round((overlapping / totalRooms) * 100)),
          );
          results.push({ date: d.toISOString().split('T')[0], occupancy });
        }
        return results;
      }),
    );
  }

  getRevenueData(userId: number): Observable<RevenueDataDto[]> {
    return this.authService.validateUser(userId).pipe(
      switchMap((user) => {
        if (!user) throw new NotFoundException('User not found');

        const today = new Date();
        const start = new Date(today);
        start.setDate(start.getDate() - 6);

        return this.invoicesService
          .findByDateRange(start.toISOString(), today.toISOString())
          .pipe(
            catchError(() => of([] as InvoiceDto[])),
            map((invoices) => {
              const byDate: Record<string, number> = {};
              for (const inv of invoices) {
                const key = new Date(inv.createdAt).toISOString().split('T')[0];
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
      }),
    );
  }

  getTopPerformingRooms(): Observable<TopPerformingRoomDto[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    return this.reservationsService.findAll().pipe(
      catchError(() => of([] as ReservationDto[])),
      map((reservations) => {
        // Filter reservations from last 30 days
        const recentReservations = reservations.filter((r) => {
          const createdAt = new Date(r.createdAt);
          return createdAt >= startDate && createdAt <= endDate;
        });

        const byRoom: Record<string, { revenue: number; nights: number }> = {};
        for (const r of recentReservations) {
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
      }),
    );
  }

  getRecentActivities(userId: number): Observable<RecentActivityDto[]> {
    return this.authService.validateUser(userId).pipe(
      switchMap((user) => {
        if (!user) {
          throw new NotFoundException('User not found');
        }

        return forkJoin({
          recentReservations: this.reservationsService.findAll().pipe(
            map((reservations) =>
              reservations
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .slice(0, 5),
            ),
            catchError(() => of([] as ReservationDto[])),
          ),
          recentInvoices: this.invoicesService.findAll().pipe(
            map((invoices) =>
              invoices
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .slice(0, 5),
            ),
            catchError(() => of([] as InvoiceDto[])),
          ),
          recentAssignments: this.housekeepingService.findAllAssignments().pipe(
            map((assignments) =>
              assignments
                .sort((a, b) => {
                  const aTime = a.completedAt
                    ? new Date(a.completedAt).getTime()
                    : 0;
                  const bTime = b.completedAt
                    ? new Date(b.completedAt).getTime()
                    : 0;
                  return bTime - aTime;
                })
                .slice(0, 5),
            ),
            catchError(() => of([] as CleaningAssignmentDto[])),
          ),
          recentRequests: this.guestRequestsService
            .findRecent(5)
            .pipe(catchError(() => of([] as GuestRequestDto[]))),
        }).pipe(
          map(
            ({
              recentReservations,
              recentInvoices,
              recentAssignments,
              recentRequests,
            }) => {
              const activities: RecentActivityDto[] = [];

              recentReservations.forEach((r) =>
                activities.push({
                  type: 'booking',
                  description: `Reservation for room ${r.roomId} - ${r.guestName}`,
                  timestamp: new Date(r.createdAt),
                }),
              );
              recentInvoices.forEach((inv) =>
                activities.push({
                  type: 'payment',
                  description: `Invoice #${inv.number} created`,
                  timestamp: new Date(inv.createdAt),
                }),
              );
              recentAssignments.forEach((a) =>
                activities.push({
                  type: 'maintenance',
                  description: `Cleaning assignment ${a.id} ${
                    a.completedAt ? 'completed' : 'in progress'
                  }`,
                  timestamp: a.completedAt
                    ? new Date(a.completedAt)
                    : new Date(a.assignedDate),
                }),
              );
              recentRequests.forEach((gr) =>
                activities.push({
                  type: 'request',
                  description: `Guest request ${gr.type} in room ${gr.room}`,
                  timestamp: new Date(gr.createdAt),
                }),
              );

              return activities
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .slice(0, 12);
            },
          ),
        );
      }),
    );
  }
}
