import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min, Max } from 'class-validator';

export class QualityScoreResponseDto {
  @ApiProperty({
    description: 'Quality score for the completed cleaning (0-10)',
    example: 9.5,
    minimum: 0,
    maximum: 10,
  })
  @IsNumber()
  @Min(0)
  @Max(10)
  qualityScore: number;

  @ApiProperty({
    description: 'Additional notes about the completed work',
    example: 'Excellent cleaning, room ready for next guest',
  })
  @IsString()
  notes: string;
}
