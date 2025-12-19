import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class UpdateCostResponseDto {
  @ApiProperty({
    description: 'Total cost of the maintenance work',
    example: 150.5,
  })
  @IsNumber()
  @Min(0)
  cost: number;

  @ApiProperty({
    description: 'Additional notes about the completed work',
    example: 'All filters replaced, system running optimally',
  })
  @IsString()
  notes: string;
}
