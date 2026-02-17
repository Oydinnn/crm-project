import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateStudentDto } from './dto/create.student.dto';
import * as bcrypt from 'bcrypt'
import { Status } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService){}

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

      return{
        success: true, 
        message: "Student created"
      }
    }

  }
