import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsString, Min } from 'class-validator';

export class UserSummaryDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;
}
