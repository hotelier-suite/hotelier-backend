import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuestRequest } from './entities/guest-request.entity';
import { CreateGuestRequestDto } from './dto/create-guest-request.dto';
import { UpdateGuestRequestDto } from './dto/update-guest-request.dto';
import { RequestStatus } from './enums/request-status.enum';
import { RequestType } from './enums/request-type.enum';
import { RequestPriority } from './enums/request-priority.enum';

@Injectable()
export class GuestRequestsService {
  constructor(
    @InjectRepository(GuestRequest)
    private readonly guestRequestRepository: Repository<GuestRequest>,
  ) {}

  async create(data: CreateGuestRequestDto): Promise<GuestRequest> {
    return this.guestRequestRepository.save(data);
  }

  async findAll(): Promise<GuestRequest[]> {
    return this.guestRequestRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<GuestRequest | null> {
    return this.guestRequestRepository.findOne({
      where: { id },
    });
  }

  async findByStatus(status: RequestStatus): Promise<GuestRequest[]> {
    return this.guestRequestRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  async findByType(type: RequestType): Promise<GuestRequest[]> {
    return this.guestRequestRepository.find({
      where: { type },
      order: { createdAt: 'DESC' },
    });
  }

  async getRequestsByPriority(
    priority: RequestPriority,
  ): Promise<GuestRequest[]> {
    return this.guestRequestRepository.find({
      where: { priority },
      order: { createdAt: 'DESC' },
    });
  }

  async findByRoom(room: string): Promise<GuestRequest[]> {
    return this.guestRequestRepository.find({
      where: { room },
      order: { createdAt: 'DESC' },
    });
  }

  async getPendingRequests(): Promise<GuestRequest[]> {
    return this.guestRequestRepository.find({
      where: { status: RequestStatus.PENDING },
      order: { createdAt: 'ASC' },
    });
  }

  async update(id: number, data: UpdateGuestRequestDto): Promise<GuestRequest> {
    await this.guestRequestRepository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new NotFoundException(`Guest request with id ${id} not found`);
    }
    return updated;
  }

  async delete(id: number): Promise<GuestRequest> {
    const request = await this.findOne(id);
    if (!request) {
      throw new NotFoundException(`Guest request with id ${id} not found`);
    }
    await this.guestRequestRepository.remove(request);
    return request;
  }

  async markAsCompleted(id: number): Promise<GuestRequest> {
    return this.update(id, {
      status: RequestStatus.COMPLETED,
      completedAt: new Date(),
    });
  }

  async assignTo(id: number, assignedTo: string): Promise<GuestRequest> {
    return this.update(id, {
      assignedTo,
      status: RequestStatus.IN_PROGRESS,
    });
  }
}
