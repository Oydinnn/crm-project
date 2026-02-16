import { IsMobilePhone, IsString } from "class-validator"

export class LoginDto{
  @IsMobilePhone("uz-UZ")
  phone:string

  @IsString()
  password:string
}