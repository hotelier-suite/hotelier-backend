import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { CreateGuestRequestDto } from './create-guest-request.dto';

export class UpdateGuestRequestDto extends PartialType(CreateGuestRequestDto) {
  @ApiProperty({
    description: 'Timestamp when the request was completed',
    required: false,
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completedAt?: Date;
}
