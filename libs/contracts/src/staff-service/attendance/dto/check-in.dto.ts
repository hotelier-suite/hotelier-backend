import { ApiProperty } from '@nestjs/swagger';
import { IsMilitaryTime, IsNotEmpty } from 'class-validator';

export class CheckInDto {
  @ApiProperty({
    description: 'Check-in time in HH:mm format (24-hour)',
    example: '09:00',
    format: 'time',
  })
  @IsNotEmpty()
  @IsMilitaryTime()
  time: string;
}
