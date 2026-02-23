import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateHomworkDto } from './dto/create.homework.dto';
import { Role } from '@prisma/client';
import { UpdateHomworkDto } from './dto/update.homework.dto';
import { title } from 'process';
import { PaginationDto } from '../students/dto/pagination.dto';

@Injectable()
export class HomeworkService {
  constructor(private prisma: PrismaService) {}

  async getOwnHomework(lessonId: number, currentUser: {id: number}){
    const myLessons = await this.prisma.homework.findMany({
      where: {
        lesson_id: lessonId
      },
      select: {
        id: true,
        title: true,
        file: true,
        created_at: true,
        updated_at: true,
        teacher:{
          select:{
            id: true,
            last_name: true,
            first_name: true,
            photo: true, 
          }
        },
        user:{
          select:{
            id: true,
            last_name: true,
            first_name: true,
            phone: true,
            photo: true
          }
        }

      }
    })

    const homeworkFormatted = myLessons.map(el=>{
        if(!el.teacher){
          return{
            id: el.id,
            title: el.title,
            file: el.file,
            created_at: el.created_at,
            updated_at: el.updated_at,
            user:el.user
          }
        }else{
          return{
            id: el.id,
            title: el.title,
            file: el.file,
            created_at: el.created_at,
            updated_at: el.updated_at,
            teacher: el.teacher
          }
        }
      })
    return{
      success: true,
      data: homeworkFormatted
    }
  }

  async getAllHomework(pageination: PaginationDto) {
    const {page = 1, limit = 10} = pageination
    const homeworks = await this.prisma.homework.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      success: true,
      data: homeworks,
    };
  }

  async createHomework(
    currentUser: { id: number; role: Role },
    payload: CreateHomworkDto,
    filename?: string,
  ) {
    const existLesson = await this.prisma.lesson.findFirst({
      where: {
        id: payload.lesson_id,
      },
      select:{group:{
        select:{
          teacher_id:true
        }
      }
        
      }
    });

    if (!existLesson) {
      throw new NotFoundException('Lesson not found with this id');
    }

    if(currentUser.role == Role.TEACHER && existLesson.group.teacher_id != currentUser.id){
      throw new ForbiddenException("it is not your lesson")
    }
    await this.prisma.homework.create({
      data: {
        lesson_id: payload.lesson_id,
        group_id: payload.group_id,
        title: payload.title,
        file: filename || '',
        teacher_id: currentUser.role == 'TEACHER' ? currentUser.id : null,
        user_id: currentUser.role != 'TEACHER' ? currentUser.id : null,
      },
    });
    return {
      success: true,
      message: 'Homework recorded',
    };
  }

  async updateHomework(
  id: number,
  payload: UpdateHomworkDto,
  currentUser?: { id: number; role: Role },
  filename?: string,
) {
  const homework = await this.prisma.homework.findUnique({
    where: { id },
  });

  if (!homework) {
    throw new NotFoundException('Homework topilmadi');
  }

  const isAllowed =
    currentUser?.role === Role.SUPERADMIN ||
    currentUser?.role === Role.ADMIN ||
    (currentUser?.role === Role.TEACHER && homework.teacher_id === currentUser.id);

  if (!isAllowed) {
    throw new ForbiddenException('Bu homeworkni yangilash huquqingiz yo‘q');
  }

  return this.prisma.homework.update({
    where: { id },
    data: {
      title: payload.title,
      file: filename ?? homework.file,  
    },
  });
  }

  async deleteHomework(id: number) {
    const homework = await this.prisma.homework.findUnique({
      where: { id },
    });

    if (!homework) {
      throw new NotFoundException('homework topilmadi');
    }

    await this.prisma.homework.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'homework deleted',
    };
  }
}
