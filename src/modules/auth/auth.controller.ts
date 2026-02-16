import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @Post("login")
  login(@Body() payload : LoginDto){
    return this.authService.login(payload)
  }
}
