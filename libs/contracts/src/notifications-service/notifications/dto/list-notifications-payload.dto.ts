import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class ListNotificationsPayloadDto {
  @ApiProperty({
    description:
      'ID of the user to filter notifications for (null for broadcast notifications)',
    required: false,
    example: 1,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number | null;

  @ApiProperty({
    description: 'Whether to include already read notifications in the results',
    required: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  includeRead?: boolean;
}
