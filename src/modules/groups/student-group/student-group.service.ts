import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateStudentDto } from 'src/modules/students/dto/create.student.dto';
import { CreateStudentGroupDto } from './dto/create.student_group.dto';
import { Status } from '@prisma/client';
import { UpdateStudentGroupDto } from './dto/update.student_group.dto';

@Injectable()
export class StudentGroupService {
  constructor(private prisma: PrismaService){}
  async createStudentGroup(payload: CreateStudentGroupDto){
    const existGroup = await this.prisma.group.findFirst({
      where:{
        id:payload.group_id,
        status: Status.active
      }
    })

    if(!existGroup) throw new NotFoundException("Group not found with this id")

    const existGroupStudentCount = await this.prisma.studentGroup.count({
      where: {
        group_id: payload.group_id
      }
    })

    const existGroupStudent = await this.prisma.studentGroup.findFirst({
      where:{
        student_id: payload.student_id,
        group_id: payload.group_id,
        status: Status.active
      }
    })

    if(existGroupStudent) throw new ConflictException("Student is already in group")

    if(existGroupStudentCount >= existGroup.max_student) throw new BadRequestException('Group is full')
    

    await this.prisma.studentGroup.create({
      data: payload
    })

    return{
      success: true,
      message: "Student added group"
    }
  }


   async getAllStudentGroup() {
      const studentGroups = await this.prisma.studentGroup.findMany({
        where: { status: 'active' },
      });
  
      return {
        success: true,
        data: studentGroups,
      };
    }
  
    async updateStudentGroup(id: number, payload: UpdateStudentGroupDto) {
      const studentGroup = await this.prisma.studentGroup.findUnique({
        where: { id },
      });
  
      if (!studentGroup) {
        throw new NotFoundException('studentGroup topilmadi');
      }
  
      return this.prisma.studentGroup.update({
        where: { id },
        data: {
          student_id: payload.student_id,
          group_id: payload.group_id,
        },
      });
    }
  
    async deleteStudentGroup(id: number) {
      const studentGroup = await this.prisma.studentGroup.findUnique({
        where: { id },
      });
  
      if (!studentGroup) {
        throw new NotFoundException('studentGroup topilmadi');
      }
  
      await this.prisma.studentGroup.delete({
        where: { id },
      });
  
      return {
        success: true,
        message: 'studentGroup deleted',
      };
    }
}
