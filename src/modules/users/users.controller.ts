import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateAdminDto } from "./dto/create.admin.dto";
import { RoleGuard } from "src/common/guards/role.guard";
import { Roles } from "src/common/decorators/role";
import { Role } from "@prisma/client";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { Authguard } from "src/common/guards/jwt-auth.guard";
import { UpdateAdminDto } from "./dto/update.admin.dto";
import { PaginationDto } from "../students/dto/pagination.dto";

@ApiBearerAuth()
@Controller('users')
export class UserController{
  constructor(private readonly userService: UsersService){}



// GET ALL ADMINS
  @ApiOperation({
    summary:`${Role.SUPERADMIN}`
  })
  @UseGuards(Authguard,RoleGuard)
  @Roles(Role.SUPERADMIN)
  @Get("admin/all")
  getAllAdmins(){
    return this.userService.getAllAdmins()
  }




  // GET ALL USERS

  @ApiOperation({
    summary:`${Role.SUPERADMIN}`
  })
  @UseGuards(Authguard,RoleGuard)
  @Roles(Role.SUPERADMIN)
  @Get("users/all")
  getAllUsers(@Query() pagination: PaginationDto){
    return this.userService.getAllUsers(pagination)
  }


// POST ADMIN
   @ApiOperation({
    summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Post('admin')
  createAdmin(@Body() payload: CreateAdminDto){
    return this.userService.createAdmin(payload)
  }



// UPDATE ADMIN
@ApiOperation({
  summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
})
@UseGuards(Authguard, RoleGuard)
@Roles(Role.SUPERADMIN, Role.ADMIN)
@Patch('admin/:id')
updateAdmin(
  @Param('id', ParseIntPipe) id: number,
  @Body() payload: UpdateAdminDto,
) {
  return this.userService.updateAdmin(id, payload);
}

// DELETE ADMIN 
@ApiOperation({
  summary: `${Role.SUPERADMIN}`
})
@UseGuards(Authguard, RoleGuard)
@Roles(Role.SUPERADMIN)
@Delete('admin/:id')
deleteAdmin(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.userService.deleteAdmin(id);
}
 
}