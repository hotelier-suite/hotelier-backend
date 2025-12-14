import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateMaintenanceRequestDto } from './dto/create-maintenance-request.dto';
import { UpdateMaintenanceRequestDto } from './dto/update-maintenance-request.dto';
import { GeneralMaintenanceRequest } from './entities/maintenance-request.entity';
import { MaintenanceStatus } from './enums/maintenance-status.enum';
import { MaintenancePriority } from './enums/maintenance-priority.enum';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(GeneralMaintenanceRequest)
    private maintenanceRequestRepository: Repository<GeneralMaintenanceRequest>,
  ) {}

  async create(
    createMaintenanceRequestDto: CreateMaintenanceRequestDto,
  ): Promise<GeneralMaintenanceRequest> {
    const maintenanceRequest = this.maintenanceRequestRepository.create(
      createMaintenanceRequestDto,
    );
    return await this.maintenanceRequestRepository.save(maintenanceRequest);
  }

  async findAll(): Promise<GeneralMaintenanceRequest[]> {
    return await this.maintenanceRequestRepository.find({
      relations: ['assignedTechnician', 'requestedBy'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<GeneralMaintenanceRequest> {
    const maintenanceRequest = await this.maintenanceRequestRepository.findOne({
      where: { id },
      relations: ['assignedTechnician', 'requestedBy'],
    });

    if (!maintenanceRequest) {
      throw new NotFoundException(
        `Maintenance request with ID ${id} not found`,
      );
    }

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
    return await this.maintenanceRequestRepository.save(maintenanceRequest);
  }

  async remove(id: number): Promise<GeneralMaintenanceRequest> {
    const maintenanceRequest = await this.findOne(id);
    return await this.maintenanceRequestRepository.remove(maintenanceRequest);
  }

  // Business logic methods
  async findByStatus(
    status: MaintenanceStatus,
  ): Promise<GeneralMaintenanceRequest[]> {
    return await this.maintenanceRequestRepository.find({
      where: { status },
      relations: ['assignedTechnician', 'requestedBy'],
      order: {
        priority: 'ASC',
        scheduledDate: 'ASC',
      },
    });
  }

  async findByPriority(
    priority: MaintenancePriority,
  ): Promise<GeneralMaintenanceRequest[]> {
    return await this.maintenanceRequestRepository.find({
      where: { priority },
      relations: ['assignedTechnician', 'requestedBy'],
      order: {
        scheduledDate: 'ASC',
      },
    });
  }

  async findByTechnician(
    technicianId: number,
  ): Promise<GeneralMaintenanceRequest[]> {
    return await this.maintenanceRequestRepository.find({
      where: { assignedTechnicianId: technicianId },
      relations: ['assignedTechnician', 'requestedBy'],
      order: {
        priority: 'ASC',
        scheduledDate: 'ASC',
      },
    });
  }

  async findScheduledForDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<GeneralMaintenanceRequest[]> {
    return await this.maintenanceRequestRepository.find({
      where: {
        scheduledDate: Between(startDate, endDate),
      },
      relations: ['assignedTechnician', 'requestedBy'],
      order: {
        scheduledDate: 'ASC',
        scheduledStartTime: 'ASC',
      },
    });
  }

  async findOverdueRequests(): Promise<GeneralMaintenanceRequest[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await this.maintenanceRequestRepository.find({
      where: {
        scheduledDate: Between(new Date('1900-01-01'), today),
        status: MaintenanceStatus.SCHEDULED,
      },
      relations: ['assignedTechnician', 'requestedBy'],
      order: {
        priority: 'ASC',
        scheduledDate: 'ASC',
      },
    });
  }

  async findUpcomingRequests(
    days: number = 7,
  ): Promise<GeneralMaintenanceRequest[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return await this.maintenanceRequestRepository.find({
      where: {
        scheduledDate: Between(today, futureDate),
        status: MaintenanceStatus.SCHEDULED,
      },
      relations: ['assignedTechnician', 'requestedBy'],
      order: {
        scheduledDate: 'ASC',
        priority: 'ASC',
      },
    });
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
    return await this.maintenanceRequestRepository.save(maintenanceRequest);
  }

  async updateStatus(
    id: number,
    status: MaintenanceStatus,
  ): Promise<GeneralMaintenanceRequest> {
    return await this.update(id, { status });
  }
}
