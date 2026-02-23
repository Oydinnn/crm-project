import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create.couse.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { UpdateCourseDto } from './dto/update.course.dto';
import { PaginationDto } from '../students/dto/pagination.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async getAllCourses(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const courses = await this.prisma.course.findMany({
      where: { status: 'active' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      success: true,
      data: courses,
    };
  }

  async createCourse(payload: CreateCourseDto) {
    const existCourse = await this.prisma.course.findUnique({
      where: { name: payload.name },
    });

    if (existCourse) throw new ConflictException('Course already exists');
    await this.prisma.course.create({
      data: payload,
    });

    return {
      success: true,
      message: 'Course created',
    };
  }

  async updateCourse(id: number, payload: UpdateCourseDto) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('course topilmadi');
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        name: payload.name,
        desc: payload.desc,
        price: payload.price,
        duration_month: payload.duration_month,
        duration_hours: payload.duration_hours,
        level: payload.level,
      },
    });
  }

  async deleteCourse(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('course topilmadi');
    }

    await this.prisma.course.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'course deleted',
    };
  }
}
