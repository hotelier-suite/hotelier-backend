import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CleaningAssignment } from '../cleaning-assignments/entities';
import { MaintenanceReport } from '../maintenance-reports/entities';
import {
  HousekeepingStatisticsDto,
  CleaningPerformanceDto,
  CleaningStatus,
  HousekeepingMaintenanceStatus,
} from '@app/contracts/operations-service';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(CleaningAssignment)
    private readonly cleaningAssignmentRepository: Repository<CleaningAssignment>,
    @InjectRepository(MaintenanceReport)
    private readonly maintenanceReportRepository: Repository<MaintenanceReport>,
  ) {}

  async getStatistics(): Promise<HousekeepingStatisticsDto> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

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
        where: { status: HousekeepingMaintenanceStatus.PENDING },
      }),
      this.maintenanceReportRepository.count({
        where: { status: HousekeepingMaintenanceStatus.IN_PROGRESS },
      }),
      this.maintenanceReportRepository.count({
        where: { status: HousekeepingMaintenanceStatus.COMPLETED },
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
      this.maintenanceReportRepository.find({
        where: { createdAt: Between(today, tomorrow) },
        order: { createdAt: 'DESC' },
      }),
      this.cleaningAssignmentRepository.find({
        where: { assignedDate: Between(today, tomorrow) },
        order: { assignedDate: 'ASC' },
      }),
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

  async getCleaningPerformance(
    employeeId?: number,
  ): Promise<CleaningPerformanceDto> {
    const whereClause = employeeId
      ? { status: CleaningStatus.COMPLETED, employeeId }
      : { status: CleaningStatus.COMPLETED };

    const assignments = await this.cleaningAssignmentRepository.find({
      where: whereClause,
    });
    const totalAssignments = await this.cleaningAssignmentRepository.count();
    const completionRate =
      totalAssignments > 0 ? (assignments.length / totalAssignments) * 100 : 0;

    const totalQuality = assignments.reduce(
      (sum, a) => sum + (a.qualityScore || 0),
      0,
    );
    const averageQualityScore =
      assignments.length > 0 ? totalQuality / assignments.length : 0;

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
      ([id, stats]) => ({
        employeeId: parseInt(id),
        completedAssignments: stats.count,
        averageQualityScore:
          stats.count > 0 ? stats.totalScore / stats.count : 0,
      }),
    );

    return { averageQualityScore, completionRate, employeePerformance };
  }
}
