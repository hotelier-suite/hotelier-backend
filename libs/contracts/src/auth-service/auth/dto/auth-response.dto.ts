import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProfileResponseDto } from './profile-response.dto';

export class AuthResponseDto {
  @ApiProperty({
    description:
      'Authenticated user information including roles and permissions',
    type: ProfileResponseDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => ProfileResponseDto)
  user: ProfileResponseDto;

  @ApiProperty({
    description: 'Access token for API authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token for obtaining new access tokens',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  refreshToken: string;
}
