import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateLessonDto{
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  group_id?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  topic?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

}