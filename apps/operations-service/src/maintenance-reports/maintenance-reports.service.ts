import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceReport } from './entities';
import {
  MaintenanceReportDto,
  CreateMaintenanceReportDto,
  UpdateMaintenanceReportDto,
  HousekeepingMaintenanceStatus,
} from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

@Injectable()
export class MaintenanceReportsService {
  constructor(
    @InjectRepository(MaintenanceReport)
    private readonly maintenanceReportRepository: Repository<MaintenanceReport>,
  ) {}

  findAll(): Promise<MaintenanceReportDto[]> {
    return this.maintenanceReportRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<MaintenanceReportDto> {
    const report = await this.maintenanceReportRepository.findOne({
      where: { id },
    });
    if (!report) {
      throw new RpcException({
        statusCode: 404,
        message: `Maintenance report with id ${id} not found`,
      });
    }
    return report;
  }

  create(data: CreateMaintenanceReportDto): Promise<MaintenanceReportDto> {
    const report = this.maintenanceReportRepository.create({
      ...data,
      reportNumber: `MR-${Date.now()}`,
      status: HousekeepingMaintenanceStatus.PENDING,
      priority: data.priority ?? TaskPriority.NORMAL,
    });
    return this.maintenanceReportRepository.save(report);
  }

  async update(
    id: number,
    data: UpdateMaintenanceReportDto,
  ): Promise<MaintenanceReportDto> {
    await this.findOne(id);
    await this.maintenanceReportRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<MaintenanceReportDto> {
    const report = await this.findOne(id);
    await this.maintenanceReportRepository.remove(report);
    return report;
  }
}
