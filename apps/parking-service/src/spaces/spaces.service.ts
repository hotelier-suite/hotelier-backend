import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';
import { ParkingSpace } from './entities';
import {
  ParkingSpaceDto,
  CreateParkingSpaceDto,
  UpdateParkingSpaceDto,
  SpaceStatus,
  SpaceType,
} from '@app/contracts/parking-service';

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(ParkingSpace)
    private readonly parkingSpaceRepository: Repository<ParkingSpace>,
  ) {}

  private readonly parkingSpaceReadSelect: FindOptionsSelect<ParkingSpace> = {
    id: true,
    code: true,
    zone: true,
    type: true,
    status: true,
    currentVehicle: true,
    hourlyRate: true,
    location: true,
    createdAt: true,
    updatedAt: true,
    vehicles: {
      id: true,
      licensePlate: true,
      brand: true,
      model: true,
      color: true,
      type: true,
      owner: true,
      room: true,
      guestType: true,
      assignedSpace: true,
      entryTime: true,
      exitTime: true,
      status: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
    },
  };

  private readonly parkingSpaceReadRelations: FindOptionsRelations<ParkingSpace> =
    {
      vehicles: true,
    };

  findAll(): Promise<ParkingSpaceDto[]> {
    return this.parkingSpaceRepository.find({
      select: this.parkingSpaceReadSelect,
      relations: this.parkingSpaceReadRelations,
      order: { code: 'ASC' },
    });
  }

  findAvailable(): Promise<ParkingSpaceDto[]> {
    return this.parkingSpaceRepository.find({
      where: { status: SpaceStatus.AVAILABLE },
      select: this.parkingSpaceReadSelect,
      relations: this.parkingSpaceReadRelations,
      order: { code: 'ASC' },
    });
  }

  findByType(type: SpaceType): Promise<ParkingSpaceDto[]> {
    return this.parkingSpaceRepository.find({
      where: { type },
      select: this.parkingSpaceReadSelect,
      relations: this.parkingSpaceReadRelations,
      order: { code: 'ASC' },
    });
  }

  findByZone(zone: string): Promise<ParkingSpaceDto[]> {
    return this.parkingSpaceRepository.find({
      where: { zone },
      select: this.parkingSpaceReadSelect,
      relations: this.parkingSpaceReadRelations,
      order: { code: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ParkingSpaceDto> {
    const space = await this.parkingSpaceRepository.findOne({
      where: { id },
      select: this.parkingSpaceReadSelect,
      relations: this.parkingSpaceReadRelations,
    });

    if (!space) {
      throw new RpcException({
        statusCode: 404,
        message: `Parking space with id ${id} not found`,
      });
    }

    return space;
  }

  async findByCode(code: string): Promise<ParkingSpaceDto> {
    const space = await this.parkingSpaceRepository.findOne({
      where: { code },
      select: this.parkingSpaceReadSelect,
      relations: this.parkingSpaceReadRelations,
    });

    if (!space) {
      throw new RpcException({
        statusCode: 404,
        message: `Parking space with code ${code} not found`,
      });
    }

    return space;
  }

  async create(data: CreateParkingSpaceDto): Promise<ParkingSpaceDto> {
    const created = await this.parkingSpaceRepository.save({
      ...data,
      status: SpaceStatus.AVAILABLE,
    });

    const loaded = await this.parkingSpaceRepository.findOne({
      where: { id: created.id },
      select: this.parkingSpaceReadSelect,
      relations: this.parkingSpaceReadRelations,
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load parking space with id ${created.id} after creation`,
      });
    }

    return loaded;
  }

  async update(
    id: number,
    data: UpdateParkingSpaceDto,
  ): Promise<ParkingSpaceDto> {
    await this.parkingSpaceRepository.update(id, data);

    return this.findOne(id);
  }

  async remove(id: number): Promise<ParkingSpaceDto> {
    const space = await this.findOne(id);
    await this.parkingSpaceRepository.remove(space);
    return space;
  }
}
