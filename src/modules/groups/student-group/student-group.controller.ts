import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { StudentGroupService } from './student-group.service';
import { CreateStudentGroupDto } from './dto/create.student_group.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Authguard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { UpdateStudentDto } from 'src/modules/students/dto/update.student.dto';
import { UpdateStudentGroupDto } from './dto/update.student_group.dto';

@ApiBearerAuth()
@Controller('student-group')
export class StudentGroupController {
  constructor(private readonly studentGroupService: StudentGroupService){}



  @ApiOperation({
      summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
      description: "Bu endpointga admin va superadmin huquqi bor"
    })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get("all")
  getAllStudentGroup(){
    return this.studentGroupService.getAllStudentGroup()
  }


  @ApiOperation({
      summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
    })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Post()
  createStudentGroup(@Body() payload: CreateStudentGroupDto) {
    return this.studentGroupService.createStudentGroup(payload);
  }



  // UPDATE
  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Patch('student-group/:id')
  updateStudentGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateStudentGroupDto,
  ) {
    return this.studentGroupService.updateStudentGroup(id, payload);
  }
  
  // DELETE
  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Delete('student-group/:id')
  deleteStudentGroup(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.studentGroupService.deleteStudentGroup(id);
  }


}
