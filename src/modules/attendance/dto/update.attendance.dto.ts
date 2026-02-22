import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateAttendanceDto {

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  idPresent?: boolean;
}
