import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateStudentDto } from './dto/create.student.dto';
import * as bcrypt from 'bcrypt'
import { Status } from '@prisma/client';
import { EmailService } from 'src/common/email/email.service';
import { UpdateStudentDto } from './dto/update.student.dto';

@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private emailService : EmailService
  
  ){}

    async getStudentOne(id: number) {
    const student = await this.prisma.student.findUnique({

    where: { id },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      address: true,
      birth_date: true,
      photo: true,
      status: true,
    },
  });

  if (!student) {
    throw new NotFoundException('Talaba topilmadi');
  }

  return {
    success: true,
    data: student,
  };
}
    

    async getAllStudents(){
      const students = await this.prisma.student.findMany({
        where: {
          status: Status.active
        },
        select:{
          id: true,
          first_name: true, 
          last_name: true,
          phone: true,
          photo: true,
          email: true,
          address: true,
          birth_date: true
        }
      })
      return{
        success: true,
        data: students
      }
    }

    async createStudent(payload: CreateStudentDto, filename?: string) {
      const existStudent = await this.prisma.student.findFirst({
        where:{
          OR:[
            {phone: payload.phone},
            {email: payload.email}
          ]
        }
      })

      if(existStudent) throw new ConflictException()

      const hashPass = await bcrypt.hash(payload.password, 10)

      await this.prisma.student.create({
        data: {
          first_name: payload.first_name,
          last_name: payload.last_name,
          photo: filename?? null,
          phone: payload.phone,
          email: payload.email,
          password: hashPass,
          address: payload.address,
          birth_date: new Date(payload.birth_date)
        }
      })

      await this.emailService.sendEmail(payload.email, payload.phone, payload.password)

      return{
        success: true, 
        message: "Student created"
      }
    }


    async updateStudent(id: number, payload: UpdateStudentDto) {
        const student = await this.prisma.student.findUnique({
          where: { id },
        });
      
        if (!student) {
          throw new NotFoundException('Student topilmadi');
        }
      
        return this.prisma.student.update({
          where: { id },
          data: {
            first_name: payload.first_name,
            last_name: payload.last_name,
            email: payload.email,
            phone: payload.phone,
            address: payload.address,
            birth_date: payload.birth_date 
            ? new Date(payload.birth_date + 'T00:00:00.000Z') 
            : undefined,
          },
        });
    }
    
    
    
    async deleteStudent(id: number) {
  
    const student = await this.prisma.student.findUnique({
      where: { id },
    });
  
    if (!student) {
      throw new NotFoundException('student topilmadi');
    }
    
    await this.prisma.student.delete({
      where: { id },
    });
  
    return {
      success: true,
      message: 'student deleted'
    }
    }

  }
