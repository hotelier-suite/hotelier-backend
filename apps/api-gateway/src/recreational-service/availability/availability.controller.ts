import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { FacilitiesService } from '../facilities';
import { FacilityAvailabilityDto } from '@app/contracts/recreational-service';
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';

@ApiTags('recreational')
@Controller('recreational/availability')
@AuditLog({ resource: AuditResource.RECREATIONAL })
@ApiBearerAuth()
export class AvailabilityController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Multiple Facilities Availability',
    description: 'Get availability for multiple facilities on a specific date',
  })
  @ApiResponse({
    status: 200,
    description: 'Multiple facilities availability information',
    type: [FacilityAvailabilityDto],
  })
  @ApiQuery({
    name: 'facilityIds',
    required: true,
    type: String,
    description: 'Comma-separated facility IDs (e.g., "1,2,3")',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    type: String,
    description: 'Date to check availability (YYYY-MM-DD)',
  })
  getMultipleFacilitiesAvailability(
    @Query('facilityIds') facilityIds: string,
    @Query('date') date: string,
  ): Observable<FacilityAvailabilityDto[]> {
    const ids = facilityIds.split(',').map((id) => parseInt(id.trim(), 10));
    return this.facilitiesService.getMultipleAvailability(ids, date);
  }
}
