import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateHomworkDto } from './dto/create.homework.dto';
import { Role } from '@prisma/client';
import { UpdateHomworkDto } from './dto/update.homework.dto';

@Injectable()
export class HomeworkService {
  constructor(private prisma: PrismaService) {}

  async getAllHomework() {
    const homeworks = await this.prisma.homework.findMany();
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
    });

    if (!existLesson) {
      throw new ForbiddenException('Lesson not found with this id');
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
