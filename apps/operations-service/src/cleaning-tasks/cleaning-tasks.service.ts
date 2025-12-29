import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CleaningTask } from './entities';
import {
  CleaningTaskDto,
  CreateCleaningTaskDto,
  UpdateCleaningTaskDto,
  CleaningStatus,
} from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

@Injectable()
export class CleaningTasksService {
  constructor(
    @InjectRepository(CleaningTask)
    private readonly cleaningTaskRepository: Repository<CleaningTask>,
  ) {}

  findAll(): Promise<CleaningTaskDto[]> {
    return this.cleaningTaskRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<CleaningTaskDto> {
    const task = await this.cleaningTaskRepository.findOne({ where: { id } });
    if (!task) {
      throw new RpcException({
        statusCode: 404,
        message: `Cleaning task with id ${id} not found`,
      });
    }
    return task;
  }

  create(data: CreateCleaningTaskDto): Promise<CleaningTaskDto> {
    const entity = this.cleaningTaskRepository.create(data);
    return this.cleaningTaskRepository.save(entity);
  }

  async update(
    id: number,
    data: UpdateCleaningTaskDto,
  ): Promise<CleaningTaskDto> {
    const existing = await this.findOne(id);
    const entity = this.cleaningTaskRepository.create(existing);
    const merged = this.cleaningTaskRepository.merge(entity, data);
    return this.cleaningTaskRepository.save(merged);
  }

  async remove(id: number): Promise<CleaningTaskDto> {
    const task = await this.findOne(id);
    const entity = this.cleaningTaskRepository.create(task);
    return this.cleaningTaskRepository.remove(entity);
  }
}
