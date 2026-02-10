import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { OPERATIONS_SERVICE_CLIENT } from '../constants';
import {
  HOUSEKEEPING_STATISTICS_PATTERNS,
  HousekeepingStatisticsDto,
  CleaningPerformanceDto,
} from '@app/contracts/operations-service';

@Injectable()
export class StatisticsService {
  constructor(
    @Inject(OPERATIONS_SERVICE_CLIENT)
    private readonly operationsClient: ClientProxy,
  ) {}

  getStatistics(): Observable<HousekeepingStatisticsDto> {
    return this.operationsClient.send<
      HousekeepingStatisticsDto,
      Record<string, never>
    >(HOUSEKEEPING_STATISTICS_PATTERNS.GET_STATISTICS, {});
  }

  getCleaningPerformance(
    employeeId?: number,
  ): Observable<CleaningPerformanceDto> {
    return this.operationsClient.send<
      CleaningPerformanceDto,
      number | undefined
    >(HOUSEKEEPING_STATISTICS_PATTERNS.GET_CLEANING_PERFORMANCE, employeeId);
  }
}
