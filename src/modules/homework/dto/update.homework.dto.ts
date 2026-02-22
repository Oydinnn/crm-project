import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateHomworkDto{
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(()=> Number)
  lesson_id?:number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(()=> Number)
  group_id?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string
}


