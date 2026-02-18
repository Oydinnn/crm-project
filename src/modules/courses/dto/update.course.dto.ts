import { ApiPropertyOptional } from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

export class UpdateCourseDto {
  @ApiPropertyOptional({ example: 'full-stack' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'description' })
  @IsString()
  @IsOptional()
  desc?: string;

  @ApiPropertyOptional({ example: '2000000' })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: '4' })
  @IsNumber()
  duration_month:number

  @ApiPropertyOptional({ example: '5' })
  @IsOptional()
  @IsNumber()
  duration_hours:number

  @ApiPropertyOptional({ example: 'advanced' })
  @IsOptional()
  @IsEnum(CourseLevel)
  level:CourseLevel
}

