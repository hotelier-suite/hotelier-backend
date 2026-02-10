import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class ListGuestsQueryDto {
  @ApiPropertyOptional({
    description:
      'Search term to filter guests by name, email, phone number, or document ID',
    example: 'john',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  search?: string;
}
