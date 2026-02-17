import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";

@Controller("users")
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @Post("user/login")
  userLogin(@Body() payload : LoginDto){
    return this.authService.userLogin(payload)
  }

  @Post("teacher/login")
  teacherLogin(@Body() payload : LoginDto){
    return this.authService.teacherLogin(payload)
  }
}
