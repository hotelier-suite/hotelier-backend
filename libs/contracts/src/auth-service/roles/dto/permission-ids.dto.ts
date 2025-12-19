import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, Min } from 'class-validator';

export class PermissionIdsDto {
  @ApiProperty({
    description: 'Permission IDs',
    type: 'array',
    items: { type: 'number' },
    example: [1, 2, 3],
  })
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  permissionIds!: number[];
}
