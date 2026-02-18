import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, IsDateString, IsEnum, IsArray, Min, Max, IsOptional } from 'class-validator';
import { GroupStatus, Week_day } from '@prisma/client';

export class CreateGroupDto {
  @ApiProperty({ example: 'n26' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Full-stack dasturchilar guruhi' })
  @IsString()
  desc?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  course_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  teacher_id: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  room_id: number;

  @ApiProperty({ example: '2025-03-01' })
  @IsDateString()
  start_date: string;

  @ApiProperty({ enum: Week_day, isArray: true, example: ['monday', 'wednesday', 'friday'] })
  @IsArray()
  @IsEnum(Week_day, { each: true })
  week_day: Week_day[];

  @ApiProperty({ example: '14:00' })
  @IsString()
  start_time: string;

  @ApiProperty({ example: 15 })
  @IsInt()
  @Min(1)
  @Max(20)    
  max_student: number;

  @ApiPropertyOptional({ enum: GroupStatus, default: GroupStatus.active, example: 'active' })
  @IsEnum(GroupStatus)
  @IsOptional()
  status?: GroupStatus;
}