import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { GuestRequestStatus } from '../enums/request-status.enum';
import { RequestPriority } from '../enums/request-priority.enum';

export class FindGuestRequestsFilterDto {
  @ApiPropertyOptional({
    description: 'Filter guest requests by their current status',
    enum: GuestRequestStatus,
    example: GuestRequestStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(GuestRequestStatus)
  status?: GuestRequestStatus;

  @ApiPropertyOptional({
    description: 'Filter guest requests by their priority level',
    enum: RequestPriority,
    example: RequestPriority.HIGH,
  })
  @IsOptional()
  @IsEnum(RequestPriority)
  priority?: RequestPriority;

  @ApiPropertyOptional({
    description: 'Limit the number of results returned (for recent requests)',
    example: 5,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
