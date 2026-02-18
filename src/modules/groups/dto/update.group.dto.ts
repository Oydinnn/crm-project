import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, IsDateString, IsEnum, IsArray, IsOptional, Min, Max } from 'class-validator';
import { GroupStatus, Week_day } from '@prisma/client';

export class UpdateGroupDto {
  @ApiPropertyOptional({ example: 'n26' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Yangilangan tavsif' })
  @IsString()
  @IsOptional()
  desc?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  course_id?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsInt()
  @IsOptional()
  teacher_id?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsInt()
  @IsOptional()
  room_id?: number;

  @ApiPropertyOptional({ example: '2025-04-01' })
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiPropertyOptional({ enum: Week_day, isArray: true, example: ['tuesday', 'thursday'] })
  @IsArray()
  @IsEnum(Week_day, { each: true })
  @IsOptional()
  week_day?: Week_day[];

  @ApiPropertyOptional({ example: '15:30' })
  @IsString()
  @IsOptional()
  start_time?: string;

  @ApiPropertyOptional({ example: 20 })
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  max_student?: number;

  @ApiPropertyOptional({ enum: GroupStatus, example: 'active' })
  @IsEnum(GroupStatus)
  @IsOptional()
  status?: GroupStatus;
}