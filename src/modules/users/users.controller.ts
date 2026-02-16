import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateAdminDto } from "./dto/create.admin.dto";

@Controller('users')
export class UserController{
  constructor(private readonly userService: UsersService){}

  @Post('admin')
  createAdmin(@Body() payload: CreateAdminDto){
    return this.userService.createAdmin(payload)
  }
}