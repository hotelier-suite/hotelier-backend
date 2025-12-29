import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { AuditAction, AuditResource } from '../enums';

export class CreateAuditLogDto {
  @ApiProperty({
    description: 'User ID who performed the action',
    example: 1,
  })
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({
    description: 'Action performed',
    enum: AuditAction,
    example: AuditAction.CREATE,
  })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty({
    description: 'Resource affected',
    enum: AuditResource,
    example: AuditResource.RESERVATION,
  })
  @IsEnum(AuditResource)
  resource: AuditResource;

  @ApiProperty({
    description: 'ID of the affected resource',
    example: '123',
    required: false,
  })
  @IsOptional()
  @IsString()
  resourceId?: string;

  @ApiProperty({
    description: 'User agent string',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    required: false,
  })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiProperty({
    description: 'Additional details about the action',
    example: { oldValue: 'pending', newValue: 'confirmed' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;

  @ApiProperty({
    description: 'Description of the action performed',
    example: 'Updated reservation status from pending to confirmed',
  })
  @IsString()
  description: string;
}
