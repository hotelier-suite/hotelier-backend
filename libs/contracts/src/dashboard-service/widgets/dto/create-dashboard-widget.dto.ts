import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsObject, IsInt, Min } from 'class-validator';

export class CreateDashboardWidgetDto {
  @ApiProperty({
    description: 'Widget title',
    example: 'Revenue Chart',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Widget type',
    example: 'chart',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Widget configuration settings',
    example: { chartType: 'line', dataSource: 'revenue' },
  })
  @IsObject()
  configuration: any;

  @ApiProperty({
    description: 'Widget data',
    example: { values: [100, 200, 300] },
    required: false,
  })
  @IsOptional()
  @IsObject()
  data?: any;

  @ApiProperty({
    description: 'Widget position on dashboard',
    example: 1,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @ApiProperty({
    description: 'Whether widget is visible',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @ApiProperty({
    description: 'User ID who owns this widget',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  userId: number;
}
