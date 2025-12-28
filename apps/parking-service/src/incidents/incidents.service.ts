import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';
import { ParkingIncident } from './entities';
import {
  ParkingIncidentDto,
  CreateParkingIncidentDto,
  UpdateParkingIncidentDto,
  IncidentStatus,
  FindIncidentsFilterDto,
} from '@app/contracts/parking-service';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(ParkingIncident)
    private readonly parkingIncidentRepository: Repository<ParkingIncident>,
  ) {}

  private readonly parkingIncidentSelect: FindOptionsSelect<ParkingIncident> = {
    id: true,
    type: true,
    description: true,
    reportDate: true,
    status: true,
    responsible: true,
    priority: true,
    resolution: true,
    resolvedAt: true,
    createdAt: true,
    updatedAt: true,
    vehicleId: true,
    spaceId: true,
  };

  findAll(filters: FindIncidentsFilterDto): Promise<ParkingIncidentDto[]> {
    return this.parkingIncidentRepository.find({
      where: filters,
      select: this.parkingIncidentSelect,
      order: { reportDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ParkingIncidentDto> {
    const incident = await this.parkingIncidentRepository.findOne({
      where: { id },
      select: this.parkingIncidentSelect,
    });

    if (!incident) {
      throw new RpcException({
        statusCode: 404,
        message: `Incident with id ${id} not found`,
      });
    }

    return incident;
  }

  create(data: CreateParkingIncidentDto): Promise<ParkingIncidentDto> {
    return this.parkingIncidentRepository.save(data);
  }

  async update(
    id: number,
    data: UpdateParkingIncidentDto,
  ): Promise<ParkingIncidentDto> {
    const existing = await this.parkingIncidentRepository.findOne({
      where: { id },
    });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `Incident with id ${id} not found`,
      });
    }

    const merged = this.parkingIncidentRepository.merge(existing, data);
    return this.parkingIncidentRepository.save(merged);
  }

  async remove(id: number): Promise<ParkingIncidentDto> {
    const incident = await this.findOne(id);
    await this.parkingIncidentRepository.remove(incident);
    return incident;
  }
}
