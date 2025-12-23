import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeneralMaintenanceRequest } from './entities/general-maintenance-request.entity';
import {
  GeneralMaintenanceRequestDto,
  CreateGeneralMaintenanceRequestDto,
  UpdateGeneralMaintenanceRequestDto,
} from '@app/contracts/operations-service/maintenance/dto';
import { MaintenanceStatus } from '@app/contracts/operations-service/maintenance/enums/maintenance-status.enum';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(GeneralMaintenanceRequest)
    private readonly maintenanceRequestRepository: Repository<GeneralMaintenanceRequest>,
  ) {}

  async findAll(): Promise<GeneralMaintenanceRequestDto[]> {
    return this.maintenanceRequestRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<GeneralMaintenanceRequestDto> {
    const request = await this.maintenanceRequestRepository.findOne({
      where: { id },
    });

    if (!request) {
      throw new RpcException({
        statusCode: 404,
        message: `Maintenance request with id ${id} not found`,
      });
    }

    return request;
  }

  async create(data: CreateGeneralMaintenanceRequestDto): Promise<GeneralMaintenanceRequestDto> {
    const request = this.maintenanceRequestRepository.create({
      ...data,
      status: MaintenanceStatus.SCHEDULED,
    });
    return this.maintenanceRequestRepository.save(request);
  }

  async update(id: number, data: UpdateGeneralMaintenanceRequestDto): Promise<GeneralMaintenanceRequestDto> {
    const existing = await this.findOne(id);

    // Auto-set timestamps based on status changes
    if (data.status === MaintenanceStatus.IN_PROGRESS && !existing.startedAt) {
      data.startedAt = new Date();
    }

    if (data.status === MaintenanceStatus.COMPLETED && !existing.completedAt) {
      data.completedAt = new Date();
    }

    await this.maintenanceRequestRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<GeneralMaintenanceRequestDto> {
    const request = await this.findOne(id);
    await this.maintenanceRequestRepository.remove(request as GeneralMaintenanceRequest);
    return request;
  }
}
