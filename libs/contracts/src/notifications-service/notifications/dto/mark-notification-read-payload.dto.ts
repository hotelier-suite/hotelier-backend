import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class MarkNotificationReadPayloadDto {
  @ApiProperty({
    description: 'Unique identifier of the notification to mark as read',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description:
      'ID of the user marking the notification as read (for authorization)',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;
}
