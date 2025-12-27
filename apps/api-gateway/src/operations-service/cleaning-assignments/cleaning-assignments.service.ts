import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { OPERATIONS_SERVICE_CLIENT } from '../constants';
import {
  CLEANING_ASSIGNMENTS_PATTERNS,
  CleaningAssignmentDto,
  CreateCleaningAssignmentDto,
  UpdateCleaningAssignmentDto,
} from '@app/contracts/operations-service';

@Injectable()
export class CleaningAssignmentsService {
  constructor(
    @Inject(OPERATIONS_SERVICE_CLIENT)
    private readonly operationsClient: ClientProxy,
  ) {}

  findAll(): Observable<CleaningAssignmentDto[]> {
    return this.operationsClient.send<
      CleaningAssignmentDto[],
      Record<string, never>
    >(CLEANING_ASSIGNMENTS_PATTERNS.FIND_ALL, {});
  }

  findOne(id: number): Observable<CleaningAssignmentDto> {
    return this.operationsClient.send<CleaningAssignmentDto, number>(
      CLEANING_ASSIGNMENTS_PATTERNS.FIND_ONE,
      id,
    );
  }

  create(data: CreateCleaningAssignmentDto): Observable<CleaningAssignmentDto> {
    return this.operationsClient.send<
      CleaningAssignmentDto,
      CreateCleaningAssignmentDto
    >(CLEANING_ASSIGNMENTS_PATTERNS.CREATE, data);
  }

  update(
    id: number,
    data: UpdateCleaningAssignmentDto,
  ): Observable<CleaningAssignmentDto> {
    return this.operationsClient.send<
      CleaningAssignmentDto,
      { id: number; data: UpdateCleaningAssignmentDto }
    >(CLEANING_ASSIGNMENTS_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<CleaningAssignmentDto> {
    return this.operationsClient.send<CleaningAssignmentDto, number>(
      CLEANING_ASSIGNMENTS_PATTERNS.DELETE,
      id,
    );
  }
}
