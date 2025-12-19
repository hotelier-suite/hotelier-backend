import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { MaintenanceReport } from './entities/maintenance-report.entity';
import { CleaningAssignment } from './entities/cleaning-assignment.entity';
import { CleaningTask } from './entities/cleaning-task.entity';
import { MaintenanceRequest } from './entities/maintenance-request.entity';
import { CreateMaintenanceReportDto } from './dto/create-maintenance-report.dto';
import { UpdateMaintenanceReportDto } from './dto/update-maintenance-report.dto';
import { CreateCleaningAssignmentDto } from './dto/create-cleaning-assignment.dto';
import { UpdateCleaningAssignmentDto } from './dto/update-cleaning-assignment.dto';
import { CreateIncidentReportDto } from './dto/create-incident-report.dto';
import { HousekeepingStatisticsDto } from './dto/housekeeping-statistics.dto';
import { MaintenanceCostsSummaryDto } from './dto/maintenance-costs-summary.dto';
import { CleaningPerformanceDto } from './dto/cleaning-performance.dto';
import { MaintenanceType } from './enums/maintenance-type.enum';
import { MaintenanceStatus } from './enums/maintenance-status.enum';
import { TaskPriority } from './enums/task-priority.enum';
import { CleaningStatus } from './enums/cleaning-status.enum';
import { Room } from '../rooms/entities/room.entity';
import { NotificationsService } from '../notifications-service/notifications/notifications.service';

@Injectable()
export class HousekeepingService {
  constructor(
    @InjectRepository(MaintenanceReport)
    private readonly maintenanceReportRepository: Repository<MaintenanceReport>,
    @InjectRepository(CleaningAssignment)
    private readonly cleaningAssignmentRepository: Repository<CleaningAssignment>,
    @InjectRepository(CleaningTask)
    private readonly cleaningTaskRepository: Repository<CleaningTask>,
    @InjectRepository(MaintenanceRequest)
    private readonly maintenanceRequestRepository: Repository<MaintenanceRequest>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly notificationsService: NotificationsService,
  ) {}

  // Maintenance Reports
  async getAllMaintenanceReports(): Promise<MaintenanceReport[]> {
    return this.maintenanceReportRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getMaintenanceReportById(
    id: number,
  ): Promise<MaintenanceReport | null> {
    return this.maintenanceReportRepository.findOne({
      where: { id },
    });
  }

  async getMaintenanceReportByNumber(
    reportNumber: string,
  ): Promise<MaintenanceReport | null> {
    return this.maintenanceReportRepository.findOne({
      where: { reportNumber },
    });
  }

  async getMaintenanceReportsByStatus(
    status: MaintenanceStatus,
  ): Promise<MaintenanceReport[]> {
    return this.maintenanceReportRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  async getMaintenanceReportsByPriority(
    priority: TaskPriority,
  ): Promise<MaintenanceReport[]> {
    return this.maintenanceReportRepository.find({
      where: { priority },
      order: { createdAt: 'DESC' },
    });
  }

  async getMaintenanceReportsByType(
    type: MaintenanceType,
  ): Promise<MaintenanceReport[]> {
    return this.maintenanceReportRepository.find({
      where: { type },
      order: { createdAt: 'DESC' },
    });
  }

  async getMaintenanceReportsByRoom(
    roomId: number,
  ): Promise<MaintenanceReport[]> {
    return this.maintenanceReportRepository.find({
      where: { roomId },
      order: { createdAt: 'DESC' },
    });
  }

  async getPendingMaintenanceReports(): Promise<MaintenanceReport[]> {
    return this.getMaintenanceReportsByStatus(MaintenanceStatus.PENDING);
  }

  async createMaintenanceReport(
    data: CreateMaintenanceReportDto,
  ): Promise<MaintenanceReport> {
    return this.maintenanceReportRepository.save({
      ...data,
      reportNumber: `MR-${Date.now()}`,
      status: MaintenanceStatus.PENDING,
    });
  }

  async updateMaintenanceReport(
    id: number,
    data: UpdateMaintenanceReportDto,
  ): Promise<MaintenanceReport> {
    await this.maintenanceReportRepository.update(id, data);
    const updated = await this.getMaintenanceReportById(id);
    if (!updated) {
      throw new NotFoundException(`Maintenance report with id ${id} not found`);
    }
    return updated;
  }

  async startMaintenanceWork(
    id: number,
    technician?: string,
  ): Promise<MaintenanceReport> {
    const report = await this.getMaintenanceReportById(id);
    if (!report) {
      throw new NotFoundException('Maintenance report not found');
    }

    return this.updateMaintenanceReport(id, {
      status: MaintenanceStatus.IN_PROGRESS,
      assignedTechnician: technician,
      startedAt: new Date(),
    });
  }

  async completeMaintenanceWork(
    id: number,
    cost?: number,
    notes?: string,
  ): Promise<MaintenanceReport> {
    const report = await this.getMaintenanceReportById(id);
    if (!report) {
      throw new NotFoundException('Maintenance report not found');
    }

    return this.updateMaintenanceReport(id, {
      status: MaintenanceStatus.COMPLETED,
      cost,
      notes,
      completedAt: new Date(),
    });
  }

  async deleteMaintenanceReport(id: number): Promise<MaintenanceReport> {
    const report = await this.getMaintenanceReportById(id);
    if (!report) {
      throw new NotFoundException(`Maintenance report with id ${id} not found`);
    }
    await this.maintenanceReportRepository.remove(report);
    return report;
  }

  // Cleaning Assignments
  async getAllCleaningAssignments(): Promise<CleaningAssignment[]> {
    return this.cleaningAssignmentRepository.find({
      order: { assignedDate: 'DESC' },
    });
  }

  async getCleaningAssignmentById(
    id: number,
  ): Promise<CleaningAssignment | null> {
    return this.cleaningAssignmentRepository.findOne({
      where: { id },
      relations: ['room'],
    });
  }

  async getCleaningAssignmentsByEmployee(
    employeeId: number,
  ): Promise<CleaningAssignment[]> {
    return this.cleaningAssignmentRepository.find({
      where: { employeeId },
      relations: ['room'],
      order: { assignedDate: 'DESC' },
    });
  }

  async getCleaningAssignmentsByRoom(
    roomId: number,
  ): Promise<CleaningAssignment[]> {
    return this.cleaningAssignmentRepository.find({
      where: { roomId },
      relations: ['room'],
      order: { assignedDate: 'DESC' },
    });
  }

  async getCleaningAssignmentsByStatus(
    status: CleaningStatus,
  ): Promise<CleaningAssignment[]> {
    return this.cleaningAssignmentRepository.find({
      where: { status },
      relations: ['room'],
      order: { assignedDate: 'DESC' },
    });
  }

  async getTodaysCleaningAssignments(): Promise<CleaningAssignment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.cleaningAssignmentRepository.find({
      where: {
        assignedDate: Between(today, tomorrow),
      },
      relations: ['room'],
      order: { assignedDate: 'ASC' },
    });
  }

  async createCleaningAssignment(
    data: CreateCleaningAssignmentDto,
  ): Promise<CleaningAssignment> {
    return this.cleaningAssignmentRepository.save({
      ...data,
      status: CleaningStatus.PENDING,
    });
  }

  async updateCleaningAssignment(
    id: number,
    data: UpdateCleaningAssignmentDto,
  ): Promise<CleaningAssignment> {
    await this.cleaningAssignmentRepository.update(id, data);
    const updated = await this.getCleaningAssignmentById(id);
    if (!updated) {
      throw new NotFoundException(
        `Cleaning assignment with id ${id} not found`,
      );
    }
    return updated;
  }

  async startCleaningWork(id: number): Promise<CleaningAssignment> {
    return this.updateCleaningAssignment(id, {
      status: CleaningStatus.IN_PROGRESS,
      startedAt: new Date(),
    });
  }

  async completeCleaningWork(
    id: number,
    qualityScore?: number,
    notes?: string,
  ): Promise<CleaningAssignment> {
    const assignment = await this.getCleaningAssignmentById(id);
    if (!assignment) {
      throw new NotFoundException('Cleaning assignment not found');
    }

    const updated = await this.updateCleaningAssignment(id, {
      status: CleaningStatus.COMPLETED,
      qualityScore,
      notes,
      completedAt: new Date(),
    });

    // When cleaning completes, mark room as available
    if (updated.roomId) {
      await this.roomRepository.update(updated.roomId, { isAvailable: true });
      const room = await this.roomRepository.findOne({
        where: { id: updated.roomId },
      });
      const roomLabel = room?.number ?? String(updated.roomId);
      this.notificationsService
        .createSystemAlert(
          'Cleaning completed',
          `Room ${roomLabel} ready and available`,
          updated.roomId,
          'ROOM',
        )
        .subscribe({
          error: (error) => {
            console.error(
              'Error creating cleaning completed notification:',
              error,
            );
          },
        });
    }

    return updated;
  }

  async deleteCleaningAssignment(id: number): Promise<CleaningAssignment> {
    const assignment = await this.getCleaningAssignmentById(id);
    if (!assignment) {
      throw new NotFoundException(
        `Cleaning assignment with id ${id} not found`,
      );
    }
    await this.cleaningAssignmentRepository.remove(assignment);
    return assignment;
  }

  // Dashboard and Analytics
  async getHousekeepingStatistics(): Promise<HousekeepingStatisticsDto> {
    const [
      pendingMaintenance,
      inProgressMaintenance,
      completedMaintenance,
      pendingCleaning,
      inProgressCleaning,
      completedCleaning,
      todaysMaintenance,
      todaysCleaning,
    ] = await Promise.all([
      this.maintenanceReportRepository.count({
        where: { status: MaintenanceStatus.PENDING },
      }),
      this.maintenanceReportRepository.count({
        where: { status: MaintenanceStatus.IN_PROGRESS },
      }),
      this.maintenanceReportRepository.count({
        where: { status: MaintenanceStatus.COMPLETED },
      }),
      this.cleaningAssignmentRepository.count({
        where: { status: CleaningStatus.PENDING },
      }),
      this.cleaningAssignmentRepository.count({
        where: { status: CleaningStatus.IN_PROGRESS },
      }),
      this.cleaningAssignmentRepository.count({
        where: { status: CleaningStatus.COMPLETED },
      }),
      this.getTodaysMaintenanceReports(),
      this.getTodaysCleaningAssignments(),
    ]);

    return {
      pendingMaintenanceReports: pendingMaintenance,
      inProgressMaintenanceReports: inProgressMaintenance,
      completedMaintenanceReports: completedMaintenance,
      pendingCleaningAssignments: pendingCleaning,
      inProgressCleaningAssignments: inProgressCleaning,
      completedCleaningAssignments: completedCleaning,
      todaysMaintenanceReports: todaysMaintenance,
      todaysCleaningAssignments: todaysCleaning,
    };
  }

  private async getTodaysMaintenanceReports(): Promise<MaintenanceReport[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.maintenanceReportRepository.find({
      where: {
        createdAt: Between(today, tomorrow),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getMaintenanceCostsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<MaintenanceCostsSummaryDto> {
    const reports = await this.maintenanceReportRepository.find({
      where: {
        status: MaintenanceStatus.COMPLETED,
        completedAt: Between(startDate, endDate),
      },
    });

    const totalCost = reports.reduce(
      (sum, report) => sum + (report.cost || 0),
      0,
    );
    const averageCost = reports.length > 0 ? totalCost / reports.length : 0;

    const costsByType = reports.map((report) => ({
      type: report.type,
      cost: report.cost || 0,
      completedAt: report.completedAt,
    }));

    return {
      totalCost,
      averageCost,
      costsByType: Object.values(MaintenanceType).map((type) => ({
        type,
        cost: costsByType
          .filter((item) => item.type === type)
          .reduce((sum, item) => sum + item.cost, 0),
      })),
    };
  }

  async getCleaningPerformanceByEmployee(
    employeeId?: number,
  ): Promise<CleaningPerformanceDto> {
    const assignments = await this.cleaningAssignmentRepository.find({
      where: employeeId
        ? { status: CleaningStatus.COMPLETED, employeeId }
        : { status: CleaningStatus.COMPLETED },
    });

    const totalAssignments = await this.cleaningAssignmentRepository.count();
    const completionRate =
      totalAssignments > 0 ? (assignments.length / totalAssignments) * 100 : 0;

    const totalQuality = assignments.reduce(
      (sum, assignment) => sum + (assignment.qualityScore || 0),
      0,
    );
    const averageQualityScore =
      assignments.length > 0 ? totalQuality / assignments.length : 0;

    // Group by employee
    const employeeStats: Record<number, { count: number; totalScore: number }> =
      {};
    for (const assignment of assignments) {
      const empId = assignment.employeeId;
      if (typeof empId !== 'number') continue;
      if (!employeeStats[empId])
        employeeStats[empId] = { count: 0, totalScore: 0 };
      employeeStats[empId].count += 1;
      employeeStats[empId].totalScore += assignment.qualityScore || 0;
    }

    const employeePerformance = Object.entries(employeeStats).map(
      ([employeeId, stats]) => ({
        employeeId: parseInt(employeeId),
        completedAssignments: stats.count,
        averageQualityScore:
          stats.count > 0 ? stats.totalScore / stats.count : 0,
      }),
    );

    return {
      averageQualityScore,
      completionRate,
      employeePerformance,
    };
  }

  async getRoomsForIncidentReports(): Promise<Room[]> {
    // Get rooms that are currently being cleaned or need cleaning
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    try {
      // 1. Get rooms with active cleaning assignments
      const roomsWithCleaningAssignments =
        await this.cleaningAssignmentRepository
          .createQueryBuilder('assignment')
          .innerJoinAndSelect('assignment.room', 'room')
          .where('assignment.assignedDate >= :today', { today })
          .andWhere('assignment.assignedDate < :tomorrow', { tomorrow })
          .andWhere('assignment.status IN (:...statuses)', {
            statuses: [CleaningStatus.IN_PROGRESS, CleaningStatus.PENDING],
          })
          .getMany();

      // 2. Get all rooms that are currently unavailable (might be in cleaning)
      const unavailableRooms = await this.roomRepository
        .createQueryBuilder('room')
        .where('room.isAvailable = :isAvailable', { isAvailable: false })
        .getMany();

      // 3. For development/testing: if no rooms found, return a few sample rooms
      // This helps when there's no real data yet
      if (
        roomsWithCleaningAssignments.length === 0 &&
        unavailableRooms.length === 0
      ) {
        const sampleRooms = await this.roomRepository
          .createQueryBuilder('room')
          .limit(3)
          .getMany();

        return sampleRooms;
      }

      // Combine results and remove duplicates
      const allRooms = new Map<number, Room>();

      // Add rooms from cleaning assignments
      roomsWithCleaningAssignments.forEach((assignment) => {
        allRooms.set(assignment.room.id, assignment.room);
      });

      // Add unavailable rooms
      unavailableRooms.forEach((room) => {
        allRooms.set(room.id, room);
      });

      return Array.from(allRooms.values());
    } catch (error) {
      console.error('Error getting rooms for incident reports:', error);
      // Fallback: return some sample rooms if there's an error
      const fallbackRooms = await this.roomRepository
        .createQueryBuilder('room')
        .limit(3)
        .getMany();

      return fallbackRooms;
    }
  }

  async createIncidentReport(
    data: CreateIncidentReportDto,
  ): Promise<MaintenanceReport> {
    // Find the room by room number
    const room = await this.roomRepository.findOne({
      where: { number: data.roomNumber },
    });

    if (!room) {
      throw new NotFoundException(`Room ${data.roomNumber} not found`);
    }

    // Update room status to unavailable (in maintenance)
    await this.roomRepository.update(room.id, { isAvailable: false });

    // Create maintenance report
    const maintenanceReport = await this.createMaintenanceReport({
      type: data.type,
      description: data.description,
      priority: data.priority,
      reportedBy: data.reportedBy || 'Housekeeping Staff',
      roomId: room.id,
    });

    // Create notification
    this.notificationsService
      .createSystemAlert(
        'New incident reported',
        `${data.type} reported in room ${room.number}: ${data.description}`,
        room.id,
        'MAINTENANCE',
      )
      .subscribe({
        error: (error) => {
          console.error(
            'Error creating incident reported notification:',
            error,
          );
        },
      });

    return maintenanceReport;
  }
}
