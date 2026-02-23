import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CourseLevel, Role } from '@prisma/client';
import { Authguard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { CreateCourseDto } from './dto/create.couse.dto';
import { UpdateCourseDto } from './dto/update.course.dto';
import { PaginationDto } from '../students/dto/pagination.dto';

@ApiBearerAuth()
@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CoursesService){}
  
  // GET ALL AND PAGINATION
    @ApiOperation({
      summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(Authguard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get()
    getAllCourses(@Query() pagination:PaginationDto ){
      return this.courseService.getAllCourses(pagination)
    }
  
  // CREATE
    @ApiOperation({
      summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(Authguard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Post()
    createCourse(@Body() payload: CreateCourseDto){
      return this.courseService.createCourse(payload)
    }


// UPDATE
    @ApiOperation({
      summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(Authguard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Patch('course/:id')
    updateCourse(
      @Param('id', ParseIntPipe) id: number,
      @Body() payload: UpdateCourseDto,
    ) {
      return this.courseService.updateCourse(id, payload);
    }
    
    // DELETE
    @ApiOperation({
      summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(Authguard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Delete('student/:id')
    deleteCourse(
      @Param('id', ParseIntPipe) id: number,
    ) {
      return this.courseService.deleteCourse(id);
    }

}
