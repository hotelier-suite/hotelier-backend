import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { OPERATIONS_SERVICE_CLIENT } from '../constants';
import {
  CLEANING_TASKS_PATTERNS,
  CleaningTaskDto,
  CreateCleaningTaskDto,
  UpdateCleaningTaskDto,
} from '@app/contracts/operations-service';

@Injectable()
export class CleaningTasksService {
  constructor(
    @Inject(OPERATIONS_SERVICE_CLIENT)
    private readonly operationsClient: ClientProxy,
  ) {}

  findAll(): Observable<CleaningTaskDto[]> {
    return this.operationsClient.send<CleaningTaskDto[], Record<string, never>>(
      CLEANING_TASKS_PATTERNS.FIND_ALL,
      {},
    );
  }

  findOne(id: number): Observable<CleaningTaskDto> {
    return this.operationsClient.send<CleaningTaskDto, number>(
      CLEANING_TASKS_PATTERNS.FIND_ONE,
      id,
    );
  }

  create(data: CreateCleaningTaskDto): Observable<CleaningTaskDto> {
    return this.operationsClient.send<CleaningTaskDto, CreateCleaningTaskDto>(
      CLEANING_TASKS_PATTERNS.CREATE,
      data,
    );
  }

  update(id: number, data: UpdateCleaningTaskDto): Observable<CleaningTaskDto> {
    return this.operationsClient.send<
      CleaningTaskDto,
      { id: number; data: UpdateCleaningTaskDto }
    >(CLEANING_TASKS_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<CleaningTaskDto> {
    return this.operationsClient.send<CleaningTaskDto, number>(
      CLEANING_TASKS_PATTERNS.DELETE,
      id,
    );
  }
}
