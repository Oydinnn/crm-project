import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendenceDto } from './dto/create.attendance.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Authguard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { UpdateAttendanceDto} from './dto/update.attendance.dto';

@ApiBearerAuth()
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService){}



  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.TEACHER}`
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)

  @Get()
  getAllAttendance(){
    return this.attendanceService.getAllAttendance()
  }





  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.TEACHER}`
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)

  @Post()
  createAttendance(
    @Body() payload: CreateAttendenceDto,
    @Req() req: Request
  ){
    return this.attendanceService.createAttendance(payload, req['user'])
  }



  // UPDATE
  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Patch('attendance/:id')
  updateAttendance(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateAttendanceDto,
  ) {
    return this.attendanceService.updateAttendance(id, payload);
  }



  
  // DELETE
  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Delete('attendance/:id')
  deleteAttendance(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.attendanceService.deleteAttendance(id);
  }
}
