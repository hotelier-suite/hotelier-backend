import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CheckInOutDto {
  @ApiProperty({
    description: 'Time in HH:MM format',
    example: '09:00',
    minLength: 5,
    maxLength: 5,
  })
  @IsString()
  @Length(5, 5)
  time: string;
}
