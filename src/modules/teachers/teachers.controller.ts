import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Authguard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateTeacherDto } from './dto/create.teacher.dto';
import { UpdateTeacherDto } from './dto/update.teacher.dto';
import { PaginationDto } from '../students/dto/pagination.dto';

@ApiBearerAuth()
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teacherService: TeachersService) {}

  //GET ALL TEACHERS

  @ApiOperation({
    summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get()
  getAllTeachers(@Query() paginition: PaginationDto) {
    return this.teacherService.getAllTeachers(paginition);
  }

  //GET one TEACHERS

  @ApiOperation({
    summary: `${Role.SUPERADMIN},${Role.ADMIN}}`,
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get('one/:id')
  getOneTeacher(@Param('id', ParseIntPipe) id: number) {
    return this.teacherService.getOneTeacher(id);
  }

  // GET TEACHER o'z ma'lumotlari va guruhlarini ko'radi (faqat o'zini)
  @ApiOperation({
    summary: `${Role.TEACHER}`,
    description: "Teacher faqat o'z ma'lumotlari va guruhlarini ko'ra oladi",
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.TEACHER)
  @Get('/me')
  getMyProfileAndGroups(@Req() req: Request) {
    const teacherId = (req as any).user?.id;
    return this.teacherService.getTeacherWithGroups(teacherId);
  }

  // GET TEACHER Groups o'z guruhlarini ko'radi (faqat o'zini)
  @ApiOperation({
    summary: `${Role.TEACHER}`,
    description: "Teacher faqat guruhlarini ko'ra oladi",
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.TEACHER)
  @Get('/getMyGroups')
  getMyGroups(@Req() req: Request) {
    const teacherId = (req as any).user?.id;
    return this.teacherService.getMyGroups(teacherId);
  }

  // GET single TEACHER Groups o'z guruhini ko'radi (faqat o'zini)

  @ApiOperation({
    summary: `${Role.TEACHER}`,
    description: "Teacher faqat guruhini id orqali ko'ra oladi",
  })
  @Get('/singleGroup/:id')
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.TEACHER)
  getSingleGroup(
    @Param('id', ParseIntPipe) groupId: number,
    @Req() req: Request
  ) {
    const teacherIdFromToken = (req as any).user?.id;

    return this.teacherService.getSingleGroup(groupId, teacherIdFromToken);
  }

  // POST TEACHERS
  @ApiOperation({
    summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
    description: 'Bu endpointga admin va superadmin huquqi bor',
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        phone: { type: 'string' },
        photo: { type: 'string', format: 'binary' },
        address: { type: 'string' },
        birth_date: { type: 'string', format: 'date', example: '2000-01-01' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './src/uploads',
        filename: (req, file, cb) => {
          const filename = Date.now() + '.' + file.mimetype.split('/')[1];
          cb(null, filename);
        },
      }),
    }),
  )
  @Post()
  createTeacher(
    @Body() payload: CreateTeacherDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.teacherService.createTeacher(payload, file.filename);
  }

  // UPDATE TEACHER
  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
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
    summary: `${Role.SUPERADMIN}`,
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN)
  @Delete('teacher/:id')
  deleteTeacher(@Param('id', ParseIntPipe) id: number) {
    return this.teacherService.deleteTeacher(id);
  }
}
