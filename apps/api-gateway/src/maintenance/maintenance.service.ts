import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { lastValueFrom } from 'rxjs';
import { EmployeeDto } from '@app/contracts/staff-service/employees/dto/employee.dto';
import { CreateMaintenanceRequestDto } from './dto/create-maintenance-request.dto';
import { UpdateMaintenanceRequestDto } from './dto/update-maintenance-request.dto';
import { GeneralMaintenanceRequest } from './entities/maintenance-request.entity';
import { MaintenanceStatus } from './enums/maintenance-status.enum';
import { MaintenancePriority } from './enums/maintenance-priority.enum';
import { EmployeesService } from '../staff-service/employees/employees.service';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(GeneralMaintenanceRequest)
    private maintenanceRequestRepository: Repository<GeneralMaintenanceRequest>,
    private readonly employeesService: EmployeesService,
  ) {}

  private async hydrateStaffDetails(
    requests: GeneralMaintenanceRequest[],
  ): Promise<void> {
    const staffIds: number[] = [];

    for (const request of requests) {
      if (request.assignedTechnicianId) {
        staffIds.push(request.assignedTechnicianId);
      }

      if (request.requestedById) {
        staffIds.push(request.requestedById);
      }
    }

    const uniqueIds = Array.from(new Set(staffIds));
    if (uniqueIds.length === 0) {
      return;
    }

    const entries = await Promise.all(
      uniqueIds.map(async (id) => {
        try {
          const employee = await lastValueFrom(
            this.employeesService.findOne(id),
          );
          return [id, employee] as const;
        } catch {
          return [id, undefined] as const;
        }
      }),
    );

    const staffById = new Map<number, EmployeeDto>();
    for (const [id, employee] of entries) {
      if (employee) {
        staffById.set(id, employee);
      }
    }

    for (const request of requests) {
      request.assignedTechnician = request.assignedTechnicianId
        ? staffById.get(request.assignedTechnicianId)
        : undefined;
      request.requestedBy = request.requestedById
        ? staffById.get(request.requestedById)
        : undefined;
    }
  }

  async create(
    createMaintenanceRequestDto: CreateMaintenanceRequestDto,
  ): Promise<GeneralMaintenanceRequest> {
    const maintenanceRequest = this.maintenanceRequestRepository.create(
      createMaintenanceRequestDto,
    );
    const saved =
      await this.maintenanceRequestRepository.save(maintenanceRequest);
    await this.hydrateStaffDetails([saved]);
    return saved;
  }

  async findAll(): Promise<GeneralMaintenanceRequest[]> {
    const requests = await this.maintenanceRequestRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    await this.hydrateStaffDetails(requests);
    return requests;
  }

  async findOne(id: number): Promise<GeneralMaintenanceRequest> {
    const maintenanceRequest = await this.maintenanceRequestRepository.findOne({
      where: { id },
    });

    if (!maintenanceRequest) {
      throw new NotFoundException(
        `Maintenance request with ID ${id} not found`,
      );
    }

    await this.hydrateStaffDetails([maintenanceRequest]);
    return maintenanceRequest;
  }

  async update(
    id: number,
    updateMaintenanceRequestDto: UpdateMaintenanceRequestDto,
  ): Promise<GeneralMaintenanceRequest> {
    const maintenanceRequest = await this.findOne(id);

    // Auto-set timestamps based on status changes
    if (
      updateMaintenanceRequestDto.status === MaintenanceStatus.IN_PROGRESS &&
      !maintenanceRequest.startedAt
    ) {
      updateMaintenanceRequestDto.startedAt = new Date();
    }

    if (
      updateMaintenanceRequestDto.status === MaintenanceStatus.COMPLETED &&
      !maintenanceRequest.completedAt
    ) {
      updateMaintenanceRequestDto.completedAt = new Date();
    }

    Object.assign(maintenanceRequest, updateMaintenanceRequestDto);
    const saved =
      await this.maintenanceRequestRepository.save(maintenanceRequest);
    await this.hydrateStaffDetails([saved]);
    return saved;
  }

  async remove(id: number): Promise<GeneralMaintenanceRequest> {
    const maintenanceRequest = await this.findOne(id);
    return await this.maintenanceRequestRepository.remove(maintenanceRequest);
  }

  // Business logic methods
  async findByStatus(
    status: MaintenanceStatus,
  ): Promise<GeneralMaintenanceRequest[]> {
    const requests = await this.maintenanceRequestRepository.find({
      where: { status },
      order: {
        priority: 'ASC',
        scheduledDate: 'ASC',
      },
    });

    await this.hydrateStaffDetails(requests);
    return requests;
  }

  async findByPriority(
    priority: MaintenancePriority,
  ): Promise<GeneralMaintenanceRequest[]> {
    const requests = await this.maintenanceRequestRepository.find({
      where: { priority },
      order: {
        scheduledDate: 'ASC',
      },
    });

    await this.hydrateStaffDetails(requests);
    return requests;
  }

  async findByTechnician(
    technicianId: number,
  ): Promise<GeneralMaintenanceRequest[]> {
    const requests = await this.maintenanceRequestRepository.find({
      where: { assignedTechnicianId: technicianId },
      order: {
        priority: 'ASC',
        scheduledDate: 'ASC',
      },
    });

    await this.hydrateStaffDetails(requests);
    return requests;
  }

  async findScheduledForDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<GeneralMaintenanceRequest[]> {
    const requests = await this.maintenanceRequestRepository.find({
      where: {
        scheduledDate: Between(startDate, endDate),
      },
      order: {
        scheduledDate: 'ASC',
        scheduledStartTime: 'ASC',
      },
    });

    await this.hydrateStaffDetails(requests);
    return requests;
  }

  async findOverdueRequests(): Promise<GeneralMaintenanceRequest[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const requests = await this.maintenanceRequestRepository.find({
      where: {
        scheduledDate: Between(new Date('1900-01-01'), today),
        status: MaintenanceStatus.SCHEDULED,
      },
      order: {
        priority: 'ASC',
        scheduledDate: 'ASC',
      },
    });

    await this.hydrateStaffDetails(requests);
    return requests;
  }

  async findUpcomingRequests(
    days: number = 7,
  ): Promise<GeneralMaintenanceRequest[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const requests = await this.maintenanceRequestRepository.find({
      where: {
        scheduledDate: Between(today, futureDate),
        status: MaintenanceStatus.SCHEDULED,
      },
      order: {
        scheduledDate: 'ASC',
        priority: 'ASC',
      },
    });

    await this.hydrateStaffDetails(requests);
    return requests;
  }

  async getMaintenanceStats(): Promise<{
    total: number;
    scheduled: number;
    inProgress: number;
    completed: number;
    overdue: number;
    byPriority: Record<MaintenancePriority, number>;
  }> {
    const total = await this.maintenanceRequestRepository.count();
    const scheduled = await this.maintenanceRequestRepository.count({
      where: { status: MaintenanceStatus.SCHEDULED },
    });
    const inProgress = await this.maintenanceRequestRepository.count({
      where: { status: MaintenanceStatus.IN_PROGRESS },
    });
    const completed = await this.maintenanceRequestRepository.count({
      where: { status: MaintenanceStatus.COMPLETED },
    });

    const overdue = await this.findOverdueRequests();

    const byPriority: Record<MaintenancePriority, number> = {
      [MaintenancePriority.LOW]: 0,
      [MaintenancePriority.MEDIUM]: 0,
      [MaintenancePriority.HIGH]: 0,
      [MaintenancePriority.URGENT]: 0,
      [MaintenancePriority.CRITICAL]: 0,
    };

    for (const priority of Object.values(MaintenancePriority)) {
      byPriority[priority] = await this.maintenanceRequestRepository.count({
        where: { priority },
      });
    }

    return {
      total,
      scheduled,
      inProgress,
      completed,
      overdue: overdue.length,
      byPriority,
    };
  }

  async assignTechnician(
    id: number,
    technicianId: number,
  ): Promise<GeneralMaintenanceRequest> {
    const maintenanceRequest = await this.findOne(id);
    maintenanceRequest.assignedTechnicianId = technicianId;
    const saved =
      await this.maintenanceRequestRepository.save(maintenanceRequest);
    await this.hydrateStaffDetails([saved]);
    return saved;
  }

  async updateStatus(
    id: number,
    status: MaintenanceStatus,
  ): Promise<GeneralMaintenanceRequest> {
    return await this.update(id, { status });
  }
}
