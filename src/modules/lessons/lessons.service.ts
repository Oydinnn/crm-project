import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateLessonDto } from './dto/craete.lesson.dto';
import { Role, Status } from '@prisma/client';
import { UpdateLessonDto } from './dto/update.lesson.dto';
import { Roles } from 'src/common/decorators/role';
import { group } from 'console';
import { PaginationDto } from '../students/dto/pagination.dto';

@Injectable()
export class LessonsService {
  constructor( private prisma: PrismaService){}
  
  
  async getMyGroupLesson(groupId: number, currentUser: {id: number}){
    const existGroup = await this.prisma.group.findFirst({
      where: {
        id: groupId,
        status: Status.active
      }
    })

    if(!existGroup){
      throw new NotFoundException("Group not found with this id")
    }

     const existGroupStudent = await this.prisma.studentGroup.findFirst({
      where: {
        group_id: groupId,
        student_id: currentUser.id,
        status: Status.active
      }
    })

    if(!existGroupStudent){
      throw new BadRequestException("Student does not belong to this group")
    }



    const groupLessons = await this.prisma.lesson.findMany({
        where:{
          group_id: groupId,
          status: Status.active
        },
        select:{
          id: true,
          topic: true,
          created_at: true
        }
      })

      return{
        success: true,
        data: groupLessons
      }
    }



    async getAllLessons(pageination: PaginationDto){
      const {page = 1, limit = 10} = pageination
      const lessons = await this.prisma.lesson.findMany({
        where:{
          status: Status.active,
        },
        skip: (page - 1) * limit,
        take: limit
      })
      return{
        success: true,
        data: lessons
      }
    }

    async createLesson(payload: CreateLessonDto, currentUser: {id:number, role: Role}){

      const existGroup = await this.prisma.group.findFirst({
        where:{
          id: payload.group_id,
          status: Status.active
        }
      })

      if(!existGroup) throw new NotFoundException("Group not found with this id")

      if(currentUser.role == 'TEACHER' && existGroup.teacher_id != currentUser.id){
          throw new ForbiddenException("Bu sening guruhing emas")
      }

      await this.prisma.lesson.create({
        data:{
           ...payload,
          teacher_id: currentUser.role == 'TEACHER' ? currentUser.id : null,
          user_id: currentUser.role != "TEACHER" ? currentUser.id : null
          }
      })
      return{
        success: true,
        message: "Lesson created"
      }
    }



    //update lesson 

    async updateLesson(id: number, payload: UpdateLessonDto, currentUser: {id: number, role: Role}) {
      
      const lesson = await this.prisma.lesson.findUnique({
        where: { id }
      });
      if(lesson?.teacher_id !== currentUser.id && currentUser.role == Role.TEACHER){
          throw new ForbiddenException("faqat lessonni yaratgan teacherda update qilish huquqi bor ! Boshqa teacher update qilolmaydi")
      }
    
        if (!lesson) {
          throw new NotFoundException('lesson topilmadi');
        }
    
        return this.prisma.lesson.update({
          where: { id },
          data: {
            group_id: payload.group_id,
            topic: payload.topic,
            description: payload.description
          },
        });
      }
    
      async deleteLesson(id: number) {
        const lesson= await this.prisma.lesson.findUnique({
          where: { id },
        });
    
        if (!lesson) {
          throw new NotFoundException('lesson topilmadi');
        }
    
        await this.prisma.lesson.delete({
          where: { id },
        });
    
        return {
          success: true,
          message: 'lesson deleted',
        };
      }
  
}
