import { IsOptional, IsNumber, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindRecreationalBookingsFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by booking date',
    example: '2024-01-15',
  })
  @IsOptional()
  @IsDate()
  date?: Date;

  @ApiPropertyOptional({
    description: 'Filter by facility ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  facilityId?: number;
}
