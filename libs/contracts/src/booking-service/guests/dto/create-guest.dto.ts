import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGuestDto {
  @ApiProperty({ example: 'John Smith' })
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  name: string;

  @ApiProperty({ example: 'john.smith@example.com' })
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({ required: false, example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, example: 'ABC123456' })
  @IsOptional()
  @IsString()
  document?: string;

  @ApiProperty({ required: false, example: '123 Main St, New York, NY' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, example: 'American' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({
    required: false,
    type: String,
    format: 'date',
    example: '1985-05-15',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthDate?: Date;

  @ApiProperty({ required: false, example: 'Non-smoking room, high floor' })
  @IsOptional()
  @IsString()
  preferences?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  vip: boolean;
}
