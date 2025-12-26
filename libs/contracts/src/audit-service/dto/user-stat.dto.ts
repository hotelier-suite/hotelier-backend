import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class UserStatDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  @IsString()
  userName: string;

  @ApiProperty({
    description: 'Count of actions by user',
    example: 85,
  })
  @IsInt()
  @Min(0)
  count: number;
}
