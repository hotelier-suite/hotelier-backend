import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ApproveRequestDto {
  @ApiProperty({
    description: 'Name or identifier of the person approving the request',
    example: 'Manager Smith',
  })
  @IsNotEmpty()
  @IsString()
  approvedBy: string;
}
