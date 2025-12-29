import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeneralMaintenanceRequest } from './entities';
import {
  GeneralMaintenanceRequestDto,
  CreateGeneralMaintenanceRequestDto,
  UpdateGeneralMaintenanceRequestDto,
  MaintenanceStatus,
} from '@app/contracts/operations-service';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(GeneralMaintenanceRequest)
    private readonly maintenanceRequestRepository: Repository<GeneralMaintenanceRequest>,
  ) {}

  findAll(): Promise<GeneralMaintenanceRequestDto[]> {
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

  create(
    data: CreateGeneralMaintenanceRequestDto,
  ): Promise<GeneralMaintenanceRequestDto> {
    return this.maintenanceRequestRepository.save(data);
  }

  async update(
    id: number,
    data: UpdateGeneralMaintenanceRequestDto,
  ): Promise<GeneralMaintenanceRequestDto> {
    const existing = await this.findOne(id);

    if (data.status === MaintenanceStatus.IN_PROGRESS && !existing.startedAt) {
      data.startedAt = new Date();
    }

    if (data.status === MaintenanceStatus.COMPLETED && !existing.completedAt) {
      data.completedAt = new Date();
    }

    const entity = this.maintenanceRequestRepository.create(existing);
    const merged = this.maintenanceRequestRepository.merge(entity, data);
    return this.maintenanceRequestRepository.save(merged);
  }

  async remove(id: number): Promise<GeneralMaintenanceRequestDto> {
    const request = await this.findOne(id);
    const entity = this.maintenanceRequestRepository.create(request);
    return this.maintenanceRequestRepository.remove(entity);
  }
}
