import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, Min } from 'class-validator';

export class UserRolesPayloadDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  @IsInt()
  @Min(1)
  userId!: number;

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
