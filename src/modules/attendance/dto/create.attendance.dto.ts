import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class CreateAttendenceDto {
  @ApiPropertyOptional()
  @IsNumber()
  lesson_id: number;

  @ApiPropertyOptional()
  @IsNumber()
  student_id: number;

  @ApiPropertyOptional()
  @IsBoolean()
  idPresent: boolean;
}
