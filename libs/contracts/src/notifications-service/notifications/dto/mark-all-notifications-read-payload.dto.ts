import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class MarkAllNotificationsReadPayloadDto {
  @ApiProperty({
    description:
      'ID of the user whose notifications should be marked as read (marks all user notifications)',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;
}
