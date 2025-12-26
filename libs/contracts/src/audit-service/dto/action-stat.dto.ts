import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class ActionStatDto {
  @ApiProperty({
    description: 'Action type',
    example: 'CREATE',
  })
  @IsString()
  action: string;

  @ApiProperty({
    description: 'Count of actions',
    example: 450,
  })
  @IsInt()
  @Min(0)
  count: number;
}
