import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, Min } from 'class-validator';

export class UserRoleIdsDto {
  @ApiProperty({
    description: 'Role IDs',
    type: 'array',
    items: { type: 'number' },
    example: [1, 2],
  })
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  roleIds!: number[];
}
