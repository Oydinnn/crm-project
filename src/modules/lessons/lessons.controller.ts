import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/craete.lesson.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Authguard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { UpdateLessonDto } from './dto/update.lesson.dto';

@ApiBearerAuth()
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonService: LessonsService){}



  @ApiOperation({
    summary:`${Role.ADMIN}`
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Get()
    getAllLessons(){
      return this.lessonService.getAllLessons()
    }




  @ApiOperation({
    summary:`${Role.ADMIN}, ${Role.TEACHER}`
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.ADMIN, Role.TEACHER, Role.SUPERADMIN)
    @Post()
    createLesson(
      @Body() payload: CreateLessonDto,
      @Req() req: Request
    ){
      return this.lessonService.createLesson(payload, req['user'])
    }



  @ApiOperation({
    summary:`${Role.ADMIN}, ${Role.TEACHER}`
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.ADMIN, Role.TEACHER, Role.SUPERADMIN)
  @Patch('/:id')
  updateLesson(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateLessonDto,
    @Req() req: Request
  ) {
    // console.log(req["user"]);
    
      const userId = req["user"]
      return this.lessonService.updateLesson(id, payload, userId);
    }


  
  // DELETE
  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Delete('/:id')
  deleteLesson(@Param('id', ParseIntPipe) id: number) {
    return this.lessonService.deleteLesson(id);
  }
}
