import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, Min } from 'class-validator';

export class SetRoomAvailabilityDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isAvailable: boolean;
}
