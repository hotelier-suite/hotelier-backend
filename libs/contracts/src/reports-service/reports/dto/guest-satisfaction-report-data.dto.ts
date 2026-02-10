import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Max, Min } from 'class-validator';

export class GuestSatisfactionReportDataDto {
  @ApiProperty({ description: 'Total number of reviews', example: 150 })
  @IsInt()
  @Min(0)
  totalReviews: number;

  @ApiProperty({ description: 'Average rating (1-5)', example: 4.5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  averageRating: number;

  @ApiProperty({ description: 'Number of 5-star reviews', example: 80 })
  @IsInt()
  @Min(0)
  fiveStarReviews: number;

  @ApiProperty({ description: 'Number of 4-star reviews', example: 40 })
  @IsInt()
  @Min(0)
  fourStarReviews: number;

  @ApiProperty({ description: 'Number of 3-star reviews', example: 20 })
  @IsInt()
  @Min(0)
  threeStarReviews: number;

  @ApiProperty({ description: 'Number of 2-star reviews', example: 7 })
  @IsInt()
  @Min(0)
  twoStarReviews: number;

  @ApiProperty({ description: 'Number of 1-star reviews', example: 3 })
  @IsInt()
  @Min(0)
  oneStarReviews: number;

  @ApiProperty({ description: 'Net Promoter Score (-100 to 100)', example: 72 })
  @IsNumber()
  @Min(-100)
  @Max(100)
  netPromoterScore: number;

  @ApiProperty({ description: 'Response rate percentage', example: 85.0 })
  @IsNumber()
  @Min(0)
  @Max(100)
  responseRate: number;
}
