import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, ValidateNested } from 'class-validator';
import { UserRoleDto } from './user-role.dto';

export class UserRoleAssignmentDto {
  @ApiProperty({ description: 'User-role assignment ID', example: 1 })
  @IsInt()
  @Min(1)
  id!: number;

  @ApiProperty({ description: 'Assigned role', type: () => UserRoleDto })
  @ValidateNested()
  @Type(() => UserRoleDto)
  role!: UserRoleDto;
}
