import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsSelect } from 'typeorm';
import { Venue } from './entities';
import {
  VenueDto,
  CreateVenueDto,
  UpdateVenueDto,
} from '@app/contracts/events-service';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
  ) {}

  private readonly venueReadSelect: FindOptionsSelect<Venue> = {
    id: true,
    name: true,
    capacity: true,
    area: true,
    hourlyRate: true,
    available: true,
    location: true,
    description: true,
    createdAt: true,
    updatedAt: true,
  };

  async create(data: CreateVenueDto): Promise<VenueDto> {
    const venue = await this.venueRepository.save(data);

    const loaded = await this.venueRepository.findOne({
      where: { id: venue.id },
      select: this.venueReadSelect,
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load venue with id ${venue.id} after creation`,
      });
    }

    return loaded;
  }

  findAll(): Promise<VenueDto[]> {
    return this.venueRepository.find({
      select: this.venueReadSelect,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<VenueDto> {
    const venue = await this.venueRepository.findOne({
      where: { id },
      select: this.venueReadSelect,
    });

    if (!venue) {
      throw new RpcException({
        statusCode: 404,
        message: `Venue with id ${id} not found`,
      });
    }

    return venue;
  }

  async update(id: number, data: UpdateVenueDto): Promise<VenueDto> {
    const existingVenue = await this.venueRepository.findOne({ where: { id } });

    if (!existingVenue) {
      throw new RpcException({
        statusCode: 404,
        message: `Venue with id ${id} not found`,
      });
    }

    await this.venueRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<VenueDto> {
    const venue = await this.venueRepository.findOne({
      where: { id },
      select: this.venueReadSelect,
    });

    if (!venue) {
      throw new RpcException({
        statusCode: 404,
        message: `Venue with id ${id} not found`,
      });
    }

    await this.venueRepository.remove(venue);
    return venue;
  }

  findAvailable(): Promise<VenueDto[]> {
    return this.venueRepository.find({
      where: { available: true },
      select: this.venueReadSelect,
      order: { name: 'ASC' },
    });
  }

  findOneEntity(id: number): Promise<Venue | null> {
    return this.venueRepository.findOne({ where: { id } });
  }
}
