import { ApiProperty } from '@nestjs/swagger';
import { IsMilitaryTime, IsNotEmpty } from 'class-validator';

export class CheckOutDto {
  @ApiProperty({
    description: 'Check-out time in HH:mm format (24-hour)',
    example: '17:00',
    format: 'time',
  })
  @IsNotEmpty()
  @IsMilitaryTime()
  time: string;
}
