import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { ParkingSpace } from './entities/parking-space.entity';
import { ParkingIncident } from './entities/parking-incident.entity';

import { GuestType } from './enums/guest-type.enum';
import { VehicleStatus } from './enums/vehicle-status.enum';
import { SpaceType } from './enums/space-type.enum';
import { SpaceStatus } from './enums/space-status.enum';
import { IncidentType } from './enums/incident-type.enum';
import { IncidentStatus } from './enums/incident-status.enum';
import { TaskPriority } from '../housekeeping/enums/task-priority.enum';

import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { CreateParkingSpaceDto } from './dto/create-parking-space.dto';
import { UpdateParkingSpaceDto } from './dto/update-parking-space.dto';
import { CreateParkingIncidentDto } from './dto/create-parking-incident.dto';
import { UpdateParkingIncidentDto } from './dto/update-parking-incident.dto';

@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(ParkingSpace)
    private readonly parkingSpaceRepository: Repository<ParkingSpace>,
    @InjectRepository(ParkingIncident)
    private readonly parkingIncidentRepository: Repository<ParkingIncident>,
  ) {}

  // Vehicle Management
  async getAllVehicles(): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      relations: { space: true, incidents: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getVehicleById(id: number): Promise<Vehicle | null> {
    return this.vehicleRepository.findOne({
      where: { id },
      relations: { space: true, incidents: true },
    });
  }

  async getVehicleByLicensePlate(
    licensePlate: string,
  ): Promise<Vehicle | null> {
    return this.vehicleRepository.findOne({
      where: { licensePlate },
      relations: { space: true, incidents: true },
    });
  }

  async getVehiclesByStatus(status: VehicleStatus): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      where: { status },
      relations: { space: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getVehiclesByGuestType(guestType: GuestType): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      where: { guestType },
      relations: { space: true },
      order: { createdAt: 'DESC' },
    });
  }

  async createVehicle(vehicleData: CreateVehicleDto): Promise<Vehicle> {
    return this.vehicleRepository.save({
      ...vehicleData,
      status: VehicleStatus.PARKED,
    });
  }

  async updateVehicle(
    id: number,
    vehicleData: UpdateVehicleDto,
  ): Promise<Vehicle> {
    await this.vehicleRepository.update(id, vehicleData);
    const updated = await this.getVehicleById(id);
    if (!updated) {
      throw new NotFoundException(`Vehicle with id ${id} not found`);
    }
    return updated;
  }

  async deleteVehicle(id: number): Promise<Vehicle> {
    const vehicle = await this.getVehicleById(id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id ${id} not found`);
    }
    await this.vehicleRepository.remove(vehicle);
    return vehicle;
  }

  async checkOutVehicle(id: number): Promise<Vehicle> {
    return this.updateVehicle(id, {
      status: VehicleStatus.EXITED,
      exitTime: new Date(),
    });
  }

  // Parking Spaces Management
  async getAllParkingSpaces(): Promise<ParkingSpace[]> {
    return this.parkingSpaceRepository.find({
      relations: { vehicles: true },
      order: { code: 'ASC' },
    });
  }

  async getParkingSpaceById(id: number): Promise<ParkingSpace | null> {
    return this.parkingSpaceRepository.findOne({
      where: { id },
      relations: { vehicles: true },
    });
  }

  async getParkingSpaceByCode(code: string): Promise<ParkingSpace | null> {
    return this.parkingSpaceRepository.findOne({
      where: { code },
      relations: { vehicles: true },
    });
  }

  async getAvailableSpaces(): Promise<ParkingSpace[]> {
    return this.parkingSpaceRepository.find({
      where: { status: SpaceStatus.AVAILABLE },
      order: { code: 'ASC' },
    });
  }

  async getSpacesByType(type: SpaceType): Promise<ParkingSpace[]> {
    return this.parkingSpaceRepository.find({
      where: { type },
      relations: { vehicles: true },
      order: { code: 'ASC' },
    });
  }

  async getSpacesByZone(zone: string): Promise<ParkingSpace[]> {
    return this.parkingSpaceRepository.find({
      where: { zone },
      relations: { vehicles: true },
      order: { code: 'ASC' },
    });
  }

  async createParkingSpace(
    spaceData: CreateParkingSpaceDto,
  ): Promise<ParkingSpace> {
    return this.parkingSpaceRepository.save({
      ...spaceData,
      status: SpaceStatus.AVAILABLE,
    });
  }

  async updateParkingSpace(
    id: number,
    spaceData: UpdateParkingSpaceDto,
  ): Promise<ParkingSpace> {
    await this.parkingSpaceRepository.update(id, spaceData);
    const updated = await this.getParkingSpaceById(id);
    if (!updated) {
      throw new NotFoundException(`Parking space with id ${id} not found`);
    }
    return updated;
  }

  async deleteParkingSpace(id: number): Promise<ParkingSpace> {
    const space = await this.getParkingSpaceById(id);
    if (!space) {
      throw new NotFoundException(`Parking space with id ${id} not found`);
    }
    await this.parkingSpaceRepository.remove(space);
    return space;
  }

  // Incident Management
  async getAllIncidents(): Promise<ParkingIncident[]> {
    return this.parkingIncidentRepository.find({
      relations: { vehicle: true, space: true },
      order: { reportDate: 'DESC' },
    });
  }

  async getIncidentById(id: number): Promise<ParkingIncident | null> {
    return this.parkingIncidentRepository.findOne({
      where: { id },
      relations: { vehicle: true, space: true },
    });
  }

  async getIncidentsByStatus(
    status: IncidentStatus,
  ): Promise<ParkingIncident[]> {
    return this.parkingIncidentRepository.find({
      where: { status },
      relations: { vehicle: true, space: true },
      order: { reportDate: 'DESC' },
    });
  }

  async getIncidentsByPriority(
    priority: TaskPriority,
  ): Promise<ParkingIncident[]> {
    return this.parkingIncidentRepository.find({
      where: { priority },
      relations: { vehicle: true, space: true },
      order: { reportDate: 'DESC' },
    });
  }

  async getIncidentsByType(type: IncidentType): Promise<ParkingIncident[]> {
    return this.parkingIncidentRepository.find({
      where: { type },
      relations: { vehicle: true, space: true },
      order: { reportDate: 'DESC' },
    });
  }

  async createIncident(
    incidentData: CreateParkingIncidentDto,
  ): Promise<ParkingIncident> {
    return this.parkingIncidentRepository.save({
      ...incidentData,
      status: IncidentStatus.PENDING,
      reportDate: new Date(),
    });
  }

  async updateIncident(
    id: number,
    incidentData: UpdateParkingIncidentDto,
  ): Promise<ParkingIncident> {
    await this.parkingIncidentRepository.update(id, incidentData);
    const updated = await this.getIncidentById(id);
    if (!updated) {
      throw new NotFoundException(`Incident with id ${id} not found`);
    }
    return updated;
  }

  async resolveIncident(
    id: number,
    resolution: string,
  ): Promise<ParkingIncident> {
    return this.updateIncident(id, {
      status: IncidentStatus.RESOLVED,
      resolution,
      resolvedAt: new Date(),
    });
  }

  async deleteIncident(id: number): Promise<ParkingIncident> {
    const incident = await this.getIncidentById(id);
    if (!incident) {
      throw new NotFoundException(`Incident with id ${id} not found`);
    }
    await this.parkingIncidentRepository.remove(incident);
    return incident;
  }
}
