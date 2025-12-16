import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class ListNotificationsPayloadDto {
  @ApiProperty({ required: false, example: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number | null;

  @ApiProperty({ required: false, example: false })
  @IsOptional()
  @IsBoolean()
  includeRead?: boolean;
}
