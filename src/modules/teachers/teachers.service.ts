import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import * as bcrypt from 'bcrypt'
import { Status } from '@prisma/client';
import { CreateTeacherDto } from './dto/create.teacher.dto';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService){}

    async getAllTeachers(){
      const teachers = await this.prisma.teacher.findMany({
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
        data: teachers
      }
    }

    async createTeacher(payload: CreateTeacherDto, filename?: string) {
      const existTeacher = await this.prisma.teacher.findFirst({
        where:{
          OR:[
            {phone: payload.phone},
            {email: payload.email}
          ]
        }
      })

      if(existTeacher) throw new ConflictException()

      const hashPass = await bcrypt.hash(payload.password, 10)

      await this.prisma.teacher.create({
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
        message: "Teacher created"
      }
    }

  }
