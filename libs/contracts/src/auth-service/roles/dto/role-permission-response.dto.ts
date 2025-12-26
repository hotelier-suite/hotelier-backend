import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, ValidateNested } from 'class-validator';
import { PermissionResponseDto } from '../../permissions';

export class RolePermissionResponseDto {
  @ApiProperty({
    description: 'Role permission assignment unique identifier',
    example: 1,
  })
  @IsNumber()
  id!: number;

  @ApiProperty({
    description: 'Role ID',
    example: 2,
  })
  @IsNumber()
  roleId!: number;

  @ApiProperty({
    description: 'Permission ID',
    example: 5,
  })
  @IsNumber()
  permissionId!: number;

  @ApiProperty({
    description: 'Permission assignment timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDate()
  createdAt!: Date;

  @ApiProperty({
    description: 'Permission assigned to the role',
    type: () => PermissionResponseDto,
  })
  @ValidateNested()
  @Type(() => PermissionResponseDto)
  permission!: PermissionResponseDto;
}
