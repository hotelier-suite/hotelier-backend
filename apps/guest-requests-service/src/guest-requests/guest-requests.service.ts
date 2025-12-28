import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import {
  CreateGuestRequestDto,
  GuestRequestDto,
  UpdateGuestRequestDto,
  GuestRequestStatus,
  FindGuestRequestsFilterDto,
} from '@app/contracts/guest-requests-service';
import { GuestRequest } from './entities';

@Injectable()
export class GuestRequestsService {
  constructor(
    @InjectRepository(GuestRequest)
    private readonly guestRequestRepository: Repository<GuestRequest>,
  ) {}

  findAll(filters: FindGuestRequestsFilterDto): Promise<GuestRequestDto[]> {
    const where: FindOptionsWhere<GuestRequest> = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    return this.guestRequestRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: filters.limit,
    });
  }

  async findOne(id: number): Promise<GuestRequestDto> {
    const request = await this.guestRequestRepository.findOne({
      where: { id },
    });

    if (!request) {
      throw new RpcException({
        statusCode: 404,
        message: `Guest request with id ${id} not found`,
      });
    }

    return request;
  }

  create(data: CreateGuestRequestDto): Promise<GuestRequestDto> {
    return this.guestRequestRepository.save(data);
  }

  async update(
    id: number,
    data: UpdateGuestRequestDto,
  ): Promise<GuestRequestDto> {
    const existing = await this.guestRequestRepository.findOne({
      where: { id },
    });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `Guest request with id ${id} not found`,
      });
    }

    const merged = this.guestRequestRepository.merge(existing, data);
    return this.guestRequestRepository.save(merged);
  }

  async remove(id: number): Promise<GuestRequestDto> {
    const request = await this.findOne(id);
    await this.guestRequestRepository.remove(request as GuestRequest);
    return request;
  }

  countByStatus(status: GuestRequestStatus): Promise<number> {
    return this.guestRequestRepository.count({
      where: { status },
    });
  }
}
