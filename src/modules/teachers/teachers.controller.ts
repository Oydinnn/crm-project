import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Authguard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateTeacherDto } from './dto/create.teacher.dto';
import { UpdateTeacherDto } from './dto/update.teacher.dto';

@ApiBearerAuth()
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teacherService: TeachersService ){}


  //GET ALL TEACHERS
  
    @ApiOperation({
      summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
    })
    @UseGuards(Authguard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get()
    getAllTeachers(){
      return this.teacherService.getAllTeachers()
    }
  
  
    // POST TEACHERS
  
    @ApiOperation({
      summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
      description: "Bu endpointga admin va superadmin huquqi bor"
    })
    @UseGuards(Authguard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiConsumes("multipart/form-data")
    @ApiBody({
      schema:{
        type: 'object',
        properties:{
          first_name: {type: 'string'},
          last_name: {type: 'string'},
          email: {type: 'string'},
          password: {type: 'string'},
          phone: {type: 'string'},
          photo: {type: 'string', format: 'binary'},
          address: {type: 'string'},
          birth_date: {type: 'string', format: 'date', example: '2000-01-01'},

        }
      }
    })
    @UseInterceptors(FileInterceptor("photo", {
      storage: diskStorage({
        destination: "./src/uploads",
        filename:(req, file, cb)=>{
          const filename = Date.now() + "." + file.mimetype.split('/')[1]
          cb(null, filename)
          
        }
      })
    }))
    @Post()
    createTeacher(
      @Body() payload : CreateTeacherDto,
      @UploadedFile() file: Express.Multer.File
    ){
      return this.teacherService.createTeacher(payload, file.filename)
    }

  
  // UPDATE TEACHER
  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Patch('teacher/:id')
  updateTeacher(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateTeacherDto,
  ) {
    return this.teacherService.updateTeacher(id, payload);
  }
  
  // DELETE TEACHER 
  @ApiOperation({
    summary: `${Role.SUPERADMIN}`
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN)
  @Delete('teacher/:id')
  deleteTeacher(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.teacherService.deleteTeacher(id);
  }
}
