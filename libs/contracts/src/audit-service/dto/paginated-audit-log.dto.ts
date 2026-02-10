import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';
import { AuditLogWithUserDto } from './audit-log-with-user.dto';

export class PaginatedAuditLogDto {
  @ApiProperty({
    description: 'Array of audit log entries',
    type: [AuditLogWithUserDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AuditLogWithUserDto)
  data: AuditLogWithUserDto[];

  @ApiProperty({
    description: 'Total number of audit logs matching the query',
    example: 150,
  })
  @IsInt()
  @Min(0)
  total: number;
}
