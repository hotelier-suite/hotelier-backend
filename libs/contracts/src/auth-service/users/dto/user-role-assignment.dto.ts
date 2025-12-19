import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';
import { UserRoleDto } from './user-role.dto';

export class UserRoleAssignmentDto {
  @ApiProperty({ description: 'User-role assignment ID', example: 1 })
  @IsNumber()
  id!: number;

  @ApiProperty({ description: 'Assigned role', type: () => UserRoleDto })
  @ValidateNested()
  @Type(() => UserRoleDto)
  role!: UserRoleDto;
}
