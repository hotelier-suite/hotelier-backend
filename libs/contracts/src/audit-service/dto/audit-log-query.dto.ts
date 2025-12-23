import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsDateString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AuditAction } from '../enums/audit-action.enum';
import { AuditResource } from '../enums/audit-resource.enum';

export class AuditLogQueryDto {
  @ApiProperty({
    description: 'Filter by user ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userId?: number;

  @ApiProperty({
    description: 'Filter by action',
    enum: AuditAction,
    example: AuditAction.CREATE,
    required: false,
  })
  @IsOptional()
  @IsEnum(AuditAction)
  action?: AuditAction;

  @ApiProperty({
    description: 'Filter by resource',
    enum: AuditResource,
    example: AuditResource.RESERVATION,
    required: false,
  })
  @IsOptional()
  @IsEnum(AuditResource)
  resource?: AuditResource;

  @ApiProperty({
    description: 'Filter by resource ID',
    example: '123',
    required: false,
  })
  @IsOptional()
  @IsString()
  resourceId?: string;

  @ApiProperty({
    description: 'Filter by start date (ISO string)',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'Filter by end date (ISO string)',
    example: '2024-01-31T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Search in description',
    example: 'reservation',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Number of records to skip',
    example: 0,
    required: false,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number = 0;

  @ApiProperty({
    description: 'Number of records to take',
    example: 50,
    required: false,
    default: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000)
  take?: number = 50;

  @ApiProperty({
    description: 'Sort order (asc or desc)',
    example: 'desc',
    required: false,
    default: 'desc',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) =>
    value?.toLowerCase() === 'asc' ? 'ASC' : 'DESC',
  )
  order?: 'ASC' | 'DESC' = 'DESC';
}
