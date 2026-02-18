import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { StudentsService } from './students.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Authguard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateStudentDto } from './dto/create.student.dto';
import { UpdateStudentDto } from './dto/update.student.dto';

@ApiBearerAuth()
@Controller('students')
export class StudentsController {
  constructor(private readonly studentService: StudentsService){}

  //GET ALL STUDENTS

  @ApiOperation({
    summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get()
  getAllStudent(){
    return this.studentService.getAllStudents()
  }


  // POST STUDENTS

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
    }),
    fileFilter: (req, file, cb)=>{
      const existFile = ["png","jpg","jpeg"]
      
      if(!existFile.includes(file.mimetype.split("/")[1])){
        cb(new UnsupportedMediaTypeException(), false)
      }
      cb(null, true)
    }
  }))
  @Post()
  createStudent(
    @Body() payload : CreateStudentDto,
    @UploadedFile() file: Express.Multer.File
  ){
    return this.studentService.createStudent(payload, file.filename)
  }



  // UPDATE STUDENT
    @ApiOperation({
      summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(Authguard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Patch('student/:id')
    updateTeacher(
      @Param('id', ParseIntPipe) id: number,
      @Body() payload: UpdateStudentDto,
    ) {
      return this.studentService.updateStudent(id, payload);
    }
    
    // DELETE STUDENT
    @ApiOperation({
      summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(Authguard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Delete('student/:id')
    deleteStudent(
      @Param('id', ParseIntPipe) id: number,
    ) {
      return this.studentService.deleteStudent(id);
    }
}
