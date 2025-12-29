import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CleaningAssignment } from './entities';
import {
  CleaningAssignmentDto,
  CreateCleaningAssignmentDto,
  UpdateCleaningAssignmentDto,
  CleaningStatus,
} from '@app/contracts/operations-service';

@Injectable()
export class CleaningAssignmentsService {
  constructor(
    @InjectRepository(CleaningAssignment)
    private readonly cleaningAssignmentRepository: Repository<CleaningAssignment>,
  ) {}

  findAll(): Promise<CleaningAssignmentDto[]> {
    return this.cleaningAssignmentRepository.find({
      order: { assignedDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<CleaningAssignmentDto> {
    const assignment = await this.cleaningAssignmentRepository.findOne({
      where: { id },
    });
    if (!assignment) {
      throw new RpcException({
        statusCode: 404,
        message: `Cleaning assignment with id ${id} not found`,
      });
    }
    return assignment;
  }

  create(data: CreateCleaningAssignmentDto): Promise<CleaningAssignmentDto> {
    return this.cleaningAssignmentRepository.save(data);
  }

  async update(
    id: number,
    data: UpdateCleaningAssignmentDto,
  ): Promise<CleaningAssignmentDto> {
    const existing = await this.findOne(id);
    const entity = this.cleaningAssignmentRepository.create(existing);
    const merged = this.cleaningAssignmentRepository.merge(entity, data);
    return this.cleaningAssignmentRepository.save(merged);
  }

  async remove(id: number): Promise<CleaningAssignmentDto> {
    const assignment = await this.findOne(id);
    const entity = this.cleaningAssignmentRepository.create(assignment);
    return this.cleaningAssignmentRepository.remove(entity);
  }
}
