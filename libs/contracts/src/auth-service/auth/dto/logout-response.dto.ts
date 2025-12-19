import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Logout confirmation message',
    example: 'Logged out successfully',
  })
  @IsString()
  message: string;
}
