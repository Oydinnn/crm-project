import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class UpdateStudentGroupDto{
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  student_id?:number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  group_id:number
}