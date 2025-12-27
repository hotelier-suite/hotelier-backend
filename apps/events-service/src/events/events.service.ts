import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsSelect } from 'typeorm';
import { Event } from './entities';
import {
  EventDto,
  CreateEventDto,
  UpdateEventDto,
} from '@app/contracts/events-service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  private readonly readSelect: FindOptionsSelect<Event> = {
    id: true,
    title: true,
    description: true,
    eventDate: true,
    startTime: true,
    endTime: true,
    venue: true,
    capacity: true,
    attendees: true,
    status: true,
    organizer: true,
    cost: true,
    revenue: true,
    createdAt: true,
    updatedAt: true,
  };

  findAll(): Promise<EventDto[]> {
    return this.eventRepository.find({
      select: this.readSelect,
      order: { eventDate: 'ASC' },
    });
  }

  async findOne(id: number): Promise<EventDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      select: this.readSelect,
    });

    if (!event) {
      throw new RpcException({
        statusCode: 404,
        message: `Event with id ${id} not found`,
      });
    }

    return event;
  }

  async create(data: CreateEventDto): Promise<EventDto> {
    const event = await this.eventRepository.save(data);

    const loaded = await this.eventRepository.findOne({
      where: { id: event.id },
      select: this.readSelect,
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load event with id ${event.id} after creation`,
      });
    }

    return loaded;
  }

  async update(id: number, data: UpdateEventDto): Promise<EventDto> {
    const existing = await this.eventRepository.findOne({ where: { id } });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `Event with id ${id} not found`,
      });
    }

    await this.eventRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<EventDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      select: this.readSelect,
    });

    if (!event) {
      throw new RpcException({
        statusCode: 404,
        message: `Event with id ${id} not found`,
      });
    }

    await this.eventRepository.remove(event);
    return event;
  }
}
