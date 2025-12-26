import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class BookingStatusBreakdownDto {
  @ApiProperty({
    description: 'Number of pending bookings',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  pending?: number;

  @ApiProperty({
    description: 'Number of confirmed bookings',
    example: 120,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  confirmed?: number;

  @ApiProperty({
    description: 'Number of checked-in bookings',
    example: 15,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  checkedIn?: number;

  @ApiProperty({
    description: 'Number of completed bookings',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  completed?: number;

  @ApiProperty({
    description: 'Number of cancelled bookings',
    example: 6,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  cancelled?: number;

  @ApiProperty({
    description: 'Number of no-show bookings',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  noShow?: number;
}
