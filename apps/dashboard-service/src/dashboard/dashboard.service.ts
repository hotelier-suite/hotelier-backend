import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { of, lastValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DashboardWidget } from './entities';
import {
  CreateDashboardWidgetDto,
  UpdateDashboardWidgetDto,
  DashboardWidgetDto,
  DashboardStatsDto,
  OccupancyDataDto,
  RevenueDataDto,
  RecentActivityDto,
  TopPerformingRoomDto,
} from '@app/contracts/dashboard-service';
import {
  ROOMS_PATTERNS,
  RESERVATIONS_PATTERNS,
  RoomDto,
  ReservationDto,
} from '@app/contracts/booking-service';
import {
  STATISTICS_PATTERNS,
  INVOICES_PATTERNS,
  FinancialSummaryResponseDto,
  InvoiceDto,
} from '@app/contracts/billing-service';
import {
  HOUSEKEEPING_PATTERNS,
  CleaningAssignmentDto,
} from '@app/contracts/operations-service';
import {
  GUEST_REQUESTS_PATTERNS,
  RequestStatus,
  GuestRequestDto,
} from '@app/contracts/guest-requests-service';
import {
  EMPLOYEES_PATTERNS,
  DepartmentStatsDto,
} from '@app/contracts/staff-service';
import { AUTH_PATTERNS } from '@app/contracts/auth-service';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(DashboardWidget)
    private readonly widgetRepository: Repository<DashboardWidget>,
    @Inject('BOOKING_SERVICE')
    private readonly bookingClient: ClientProxy,
    @Inject('BILLING_SERVICE')
    private readonly billingClient: ClientProxy,
    @Inject('OPERATIONS_SERVICE')
    private readonly operationsClient: ClientProxy,
    @Inject('GUEST_REQUESTS_SERVICE')
    private readonly guestRequestsClient: ClientProxy,
    @Inject('STAFF_SERVICE')
    private readonly staffClient: ClientProxy,
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  // Widget CRUD operations
  async createWidget(
    data: CreateDashboardWidgetDto,
  ): Promise<DashboardWidgetDto> {
    const widget = this.widgetRepository.create(data);
    return this.widgetRepository.save(widget);
  }

  async findAllWidgets(): Promise<DashboardWidgetDto[]> {
    return this.widgetRepository.find({
      where: { visible: true },
      order: { position: 'ASC' },
    });
  }

  async findOneWidget(id: number): Promise<DashboardWidgetDto> {
    const widget = await this.widgetRepository.findOne({ where: { id } });
    if (!widget) {
      throw new RpcException({
        statusCode: 404,
        message: `Widget with id ${id} not found`,
      });
    }
    return widget;
  }

  async updateWidget(
    id: number,
    data: UpdateDashboardWidgetDto,
  ): Promise<DashboardWidgetDto> {
    await this.widgetRepository.update(id, data);
    return this.findOneWidget(id);
  }

  async deleteWidget(id: number): Promise<DashboardWidgetDto> {
    const widget = await this.findOneWidget(id);
    await this.widgetRepository.remove(widget as DashboardWidget);
    return { ...widget, id };
  }

  async findWidgetsByUser(userId: number): Promise<DashboardWidgetDto[]> {
    return this.widgetRepository.find({
      where: { userId, visible: true },
      order: { position: 'ASC' },
    });
  }

  // Statistics operations
  async getDashboardStats(userId: number): Promise<DashboardStatsDto> {
    // Validate user first using GET_PROFILE pattern
    const user = await lastValueFrom(
      this.authClient
        .send<{ id: number } | null, number>(AUTH_PATTERNS.GET_PROFILE, userId)
        .pipe(catchError(() => of(null))),
    );

    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    const today = new Date();
    const dayStart = new Date(today);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(today);
    dayEnd.setHours(23, 59, 59, 999);

    const [
      rooms,
      reservations,
      financialSummary,
      departmentStats,
      pendingRequests,
    ] = await Promise.all([
      lastValueFrom(
        this.bookingClient
          .send<RoomDto[], Record<string, never>>(ROOMS_PATTERNS.FIND_ALL, {})
          .pipe(catchError(() => of([]))),
      ),
      lastValueFrom(
        this.bookingClient
          .send<
            ReservationDto[],
            Record<string, never>
          >(RESERVATIONS_PATTERNS.FIND_ALL, {})
          .pipe(catchError(() => of([]))),
      ),
      lastValueFrom(
        this.billingClient
          .send<
            FinancialSummaryResponseDto,
            { startDate: string; endDate: string }
          >(STATISTICS_PATTERNS.FINANCIAL_SUMMARY, {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          })
          .pipe(catchError(() => of({ totalRevenue: 0 }))),
      ),
      lastValueFrom(
        this.staffClient
          .send<
            DepartmentStatsDto[],
            Record<string, never>
          >(EMPLOYEES_PATTERNS.GET_DEPARTMENT_STATS, {})
          .pipe(catchError(() => of([] as DepartmentStatsDto[]))),
      ),
      lastValueFrom(
        this.guestRequestsClient
          .send<
            number,
            RequestStatus
          >(GUEST_REQUESTS_PATTERNS.COUNT_BY_STATUS, RequestStatus.PENDING)
          .pipe(catchError(() => of(0))),
      ),
    ]);

    const totalRooms = rooms.length;
    const availableRooms = rooms.filter((r: RoomDto) => r.isAvailable).length;

    const todayCheckIns = reservations.filter((r: ReservationDto) => {
      const checkIn = new Date(r.checkInDate);
      return checkIn >= dayStart && checkIn <= dayEnd;
    }).length;

    const todayCheckOuts = reservations.filter((r: ReservationDto) => {
      const checkOut = new Date(r.checkOutDate);
      return checkOut >= dayStart && checkOut <= dayEnd;
    }).length;

    const activeStaff = Array.isArray(departmentStats)
      ? departmentStats.reduce(
          (sum: number, s: DepartmentStatsDto) => sum + (s.activeCount ?? 0),
          0,
        )
      : 0;

    return {
      totalRooms,
      occupiedRooms: Math.max(0, totalRooms - availableRooms),
      availableRooms,
      totalRevenue: financialSummary.totalRevenue || 0,
      todayCheckIns,
      todayCheckOuts,
      pendingRequests:
        typeof pendingRequests === 'number' ? pendingRequests : 0,
      activeStaff,
    };
  }

  async getOccupancyData(): Promise<OccupancyDataDto[]> {
    const [rooms, reservations] = await Promise.all([
      lastValueFrom(
        this.bookingClient
          .send<RoomDto[], Record<string, never>>(ROOMS_PATTERNS.FIND_ALL, {})
          .pipe(catchError(() => of([]))),
      ),
      lastValueFrom(
        this.bookingClient
          .send<
            ReservationDto[],
            Record<string, never>
          >(RESERVATIONS_PATTERNS.FIND_ALL, {})
          .pipe(catchError(() => of([]))),
      ),
    ]);

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

      const overlapping = reservations.filter((r: ReservationDto) => {
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
  }

  async getRevenueData(userId: number): Promise<RevenueDataDto[]> {
    const user = await lastValueFrom(
      this.authClient
        .send<{ id: number } | null, number>(AUTH_PATTERNS.GET_PROFILE, userId)
        .pipe(catchError(() => of(null))),
    );

    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });
    }

    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 6);

    const invoices = await lastValueFrom(
      this.billingClient
        .send<InvoiceDto[], { startDate: string; endDate: string }>(
          INVOICES_PATTERNS.FIND_BY_DATE_RANGE,
          {
            startDate: start.toISOString(),
            endDate: today.toISOString(),
          },
        )
        .pipe(catchError(() => of([]))),
    );

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
  }

  async getTopPerformingRooms(): Promise<TopPerformingRoomDto[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    const reservations = await lastValueFrom(
      this.bookingClient
        .send<
          ReservationDto[],
          Record<string, never>
        >(RESERVATIONS_PATTERNS.FIND_ALL, {})
        .pipe(catchError(() => of([] as ReservationDto[]))),
    );

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

    return Object.entries(byRoom)
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
  }

  async getRecentActivities(userId: number): Promise<RecentActivityDto[]> {
    const user = await lastValueFrom(
      this.authClient
        .send<{ id: number } | null, number>(AUTH_PATTERNS.GET_PROFILE, userId)
        .pipe(catchError(() => of(null))),
    );

    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });
    }

    const [reservations, invoices, assignments, guestRequests] =
      await Promise.all([
        lastValueFrom(
          this.bookingClient
            .send<
              ReservationDto[],
              Record<string, never>
            >(RESERVATIONS_PATTERNS.FIND_ALL, {})
            .pipe(catchError(() => of([]))),
        ),
        lastValueFrom(
          this.billingClient
            .send<
              InvoiceDto[],
              Record<string, never>
            >(INVOICES_PATTERNS.FIND_ALL, {})
            .pipe(catchError(() => of([]))),
        ),
        lastValueFrom(
          this.operationsClient
            .send<
              CleaningAssignmentDto[],
              Record<string, never>
            >(HOUSEKEEPING_PATTERNS.FIND_ALL_ASSIGNMENTS, {})
            .pipe(catchError(() => of([]))),
        ),
        lastValueFrom(
          this.guestRequestsClient
            .send<
              GuestRequestDto[],
              number
            >(GUEST_REQUESTS_PATTERNS.FIND_RECENT, 5)
            .pipe(catchError(() => of([]))),
        ),
      ]);

    const activities: RecentActivityDto[] = [];

    // Recent reservations
    const recentReservations = [...reservations]
      .sort(
        (a: ReservationDto, b: ReservationDto) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);

    recentReservations.forEach((r: ReservationDto) =>
      activities.push({
        type: 'booking',
        description: `Reservation for room ${r.roomId} - ${r.guestName}`,
        timestamp: new Date(r.createdAt),
      }),
    );

    // Recent invoices
    const recentInvoices = [...invoices]
      .sort(
        (a: InvoiceDto, b: InvoiceDto) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);

    recentInvoices.forEach((inv: InvoiceDto) =>
      activities.push({
        type: 'payment',
        description: `Invoice #${inv.number} created`,
        timestamp: new Date(inv.createdAt),
      }),
    );

    // Recent assignments
    const recentAssignments = [...assignments]
      .sort((a: CleaningAssignmentDto, b: CleaningAssignmentDto) => {
        const aTime = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const bTime = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 5);

    recentAssignments.forEach((a: CleaningAssignmentDto) =>
      activities.push({
        type: 'maintenance',
        description: `Cleaning assignment ${a.id} ${a.completedAt ? 'completed' : 'in progress'}`,
        timestamp: a.completedAt
          ? new Date(a.completedAt)
          : new Date(a.assignedDate),
      }),
    );

    // Recent guest requests
    guestRequests.forEach((gr: GuestRequestDto) =>
      activities.push({
        type: 'request',
        description: `Guest request ${gr.type} in room ${gr.room}`,
        timestamp: new Date(gr.createdAt),
      }),
    );

    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 12);
  }
}
