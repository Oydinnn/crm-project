import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateAdminDto } from "./dto/create.admin.dto";
import { RoleGuard } from "src/common/guards/role.guard";
import { Roles } from "src/common/decorators/role";
import { Role } from "@prisma/client";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { Authguard } from "src/common/guards/jwt-auth.guard";

@ApiBearerAuth()
@Controller('users')
export class UserController{
  constructor(private readonly userService: UsersService){}

  @ApiOperation({
    summary:`${Role.SUPERADMIN}`
  })
  @UseGuards(Authguard,RoleGuard)
  @Roles(Role.SUPERADMIN)
  @Get("admin/all")
  getAllAdmins(){
    return this.userService.getAllAdmins()
  }

   @ApiOperation({
    summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Post('admin')
  createAdmin(@Body() payload: CreateAdminDto){
    return this.userService.createAdmin(payload)
  }
}