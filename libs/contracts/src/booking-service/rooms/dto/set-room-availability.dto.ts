import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, Min } from 'class-validator';

export class SetRoomAvailabilityDto {
  @ApiProperty({
    description: 'Unique identifier for the room',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Whether the room is currently available for booking',
    example: true,
  })
  @IsBoolean()
  isAvailable: boolean;
}
