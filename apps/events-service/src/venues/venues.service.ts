import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async create(data: CreateVenueDto): Promise<VenueDto> {
    const venue = await this.venueRepository.save(data);
    return this.toDto(venue);
  }

  async findAll(): Promise<VenueDto[]> {
    const venues = await this.venueRepository.find({
      relations: {
        events: true,
      },
      order: {
        name: 'ASC',
      },
    });
    return venues.map((venue) => this.toDto(venue));
  }

  async findOne(id: number): Promise<VenueDto> {
    const venue = await this.venueRepository.findOne({
      where: { id },
      relations: {
        events: true,
      },
    });
    if (!venue) {
      throw new NotFoundException(`Venue with id ${id} not found`);
    }
    return this.toDto(venue);
  }

  async update(id: number, data: UpdateVenueDto): Promise<VenueDto> {
    const existingVenue = await this.venueRepository.findOne({ where: { id } });
    if (!existingVenue) {
      throw new NotFoundException(`Venue with id ${id} not found`);
    }

    await this.venueRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<VenueDto> {
    const venue = await this.venueRepository.findOne({
      where: { id },
      relations: { events: true },
    });
    if (!venue) {
      throw new NotFoundException(`Venue with id ${id} not found`);
    }
    const dto = this.toDto(venue);
    await this.venueRepository.remove(venue);
    return dto;
  }

  async getAvailableVenues(): Promise<VenueDto[]> {
    const venues = await this.venueRepository.find({
      where: { available: true },
      order: { name: 'ASC' },
    });
    return venues.map((venue) => this.toDto(venue));
  }

  async findOneEntity(id: number): Promise<Venue | null> {
    return this.venueRepository.findOne({ where: { id } });
  }

  private toDto(venue: Venue): VenueDto {
    return {
      id: venue.id,
      name: venue.name,
      capacity: venue.capacity,
      area: Number(venue.area),
      hourlyRate: Number(venue.hourlyRate),
      available: venue.available,
      location: venue.location,
      description: venue.description,
      createdAt: venue.createdAt,
      updatedAt: venue.updatedAt,
    };
  }
}
