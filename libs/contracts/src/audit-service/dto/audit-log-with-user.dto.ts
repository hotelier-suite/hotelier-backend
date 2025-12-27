import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AuditLogDto } from './audit-log.dto';
import { UserSummaryDto } from '@app/contracts/auth-service';

export class AuditLogWithUserDto extends AuditLogDto {
  @ApiProperty({
    description: 'User information associated with the audit log',
    required: false,
    type: () => UserSummaryDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserSummaryDto)
  user?: UserSummaryDto;
}
