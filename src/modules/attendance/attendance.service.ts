import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateAttendenceDto } from './dto/create.attendance.dto';
import { Role, Status } from '@prisma/client';
import { UpdateAttendanceDto } from './dto/update.attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async getAllAttendance(){
    const attendance = await this.prisma.attendance.findMany()

      return{
        success: true,
        data: attendance
      }
  }

  async createAttendance(
    payload: CreateAttendenceDto,
    currentUser: { id: number; role: Role },
  ) {

    const week = {
      "1": "MONDAY",
      "2": "TUESDAY",
      "3": "WEDNESDAY",
      "4": "THURSDAY",
      "5": "FRIDAY",
      "6": "SATURDAY",
      "7": "SUNDAY",

    }

    const lessonGroup = await this.prisma.lesson.findFirst({
      where: {
        id: payload.lesson_id
      },
      select:{
        created_at: true,
        group:{
          select:{
            start_time: true,
            start_date: true,
            teacher_id: true,
            week_day: true,
            course:{
              select:{
                duration_hours: true
              }
            },
            studentGroup: {
              where:{
                student_id: payload.student_id,
                status: Status.active
              }
            }
          }
        }
      }
    })

    if(!lessonGroup?.group.studentGroup.length){
      throw new BadRequestException("Student not found with this group")
    }

    if(currentUser.role == Role.TEACHER && lessonGroup?.group.teacher_id != currentUser.id){
      throw new ForbiddenException("is not your lesson")
    }
    const week_day = lessonGroup?.group.week_day
    const nowDate = new Date()
    const day = nowDate.getDay()
  
    if(!week_day?.includes(week_day[day])){
      throw new BadRequestException("Dars vaxti hali boshlanmadi")
    }


    const timeToMinute = (time: string) =>{
      const [h, m] = time.split(":").map(Number)
      return h * 60 + m;
    }

    const startMinute = timeToMinute(lessonGroup!.group.start_time)
    const endMinute = startMinute + lessonGroup!.group.course.duration_hours * 60
    const nowMinute = nowDate.getHours() * 60 + nowDate.getMinutes()


    if(!(lessonGroup.created_at.getTime() < Date.now())  && startMinute > nowMinute){
      throw new BadRequestException('dars hali boshlanmadi')
    }
    if(!(startMinute < nowMinute && endMinute > nowMinute) && currentUser.role == Role.TEACHER){
      throw new BadRequestException('dars vaqtidan tashqari davomat qilib bulmaydi')
    }


    await this.prisma.attendance.create({
      data: {
        ...payload,
        teacher_id: currentUser.role == 'TEACHER' ? currentUser.id : null,
        user_id: currentUser.role != 'TEACHER' ? currentUser.id : null,
      },
    });

    return {
      success: true,
      message: 'Attendance recorded',
    };
  }




  async updateAttendance(id: number, payload: UpdateAttendanceDto) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });
  
    if (!attendance) {
      throw new NotFoundException('Attendance topilmadi');
    }
  
    return this.prisma.attendance.update({
      where: { id },
      data: {
        idPresent: payload.idPresent
      },
    });
  }
      
      
      
  async deleteAttendance(id: number) {

  const attendance = await this.prisma.attendance.findUnique({
    where: { id },
  });

  if (!attendance) {
    throw new NotFoundException('Attendance topilmadi');
  }
  
  await this.prisma.attendance.delete({
    where: { id },
  });

  return {
    success: true,
    message: 'Attendance deleted'
  }
  }
}
