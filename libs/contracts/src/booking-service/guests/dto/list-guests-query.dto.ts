import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class ListGuestsQueryDto {
  @ApiProperty({ required: false, example: 'john' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  search?: string;
}
