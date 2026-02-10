import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class ResourceStatDto {
  @ApiProperty({
    description: 'Resource type',
    example: 'RESERVATION',
  })
  @IsString()
  resource: string;

  @ApiProperty({
    description: 'Count of resources',
    example: 320,
  })
  @IsInt()
  @Min(0)
  count: number;
}
