import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, Min, ValidateNested } from 'class-validator';
import { PermissionResponseDto } from '../../permissions';

export class RolePermissionResponseDto {
  @ApiProperty({
    description: 'Role permission assignment unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id!: number;

  @ApiProperty({
    description: 'Role ID',
    example: 2,
  })
  @IsInt()
  @Min(1)
  roleId!: number;

  @ApiProperty({
    description: 'Permission ID',
    example: 5,
  })
  @IsInt()
  @Min(1)
  permissionId!: number;

  @ApiProperty({
    description: 'Permission assignment timestamp',
    example: '2024-01-01T00:00:00.000Z',
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({
    description: 'Permission assigned to the role',
    type: () => PermissionResponseDto,
  })
  @ValidateNested()
  @Type(() => PermissionResponseDto)
  permission!: PermissionResponseDto;
}
