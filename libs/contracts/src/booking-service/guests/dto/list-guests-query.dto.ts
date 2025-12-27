import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class ListGuestsQueryDto {
  @ApiProperty({
    description: 'Search term to filter guests by name or email',
    required: false,
    example: 'john',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  search?: string;
}
