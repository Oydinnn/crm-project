import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create.admin.dto';
import bcrypt from "bcrypt"
import { PrismaService } from 'src/core/database/prisma.service';
import { Role, Status } from '@prisma/client';
import { UpdateAdminDto } from './dto/update.admin.dto';
import { PaginationDto } from '../students/dto/pagination.dto';


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService){}



  async getAllAdmins(){
    const admins = await this.prisma.user.findMany({
      where: {
        status: Status.active,
        role: Role.ADMIN
      },
      select: {
        id: true,
        first_name: true, 
        last_name: true,
        email: true,
        phone: true,
        photo: true,
        role: true
      }
    })
    return {
      success: true,
      data: admins
    }
  }



  async getAllUsers(pagination: PaginationDto){
    const { page = 1, limit = 10} = pagination
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        first_name: true, 
        last_name: true,
        email: true,
        phone: true,
        photo: true,
        role: true
      },
      skip: (page -1) * limit,
      take: limit
    })
    return {
      success: true,
      data: users
    }
  }



  async createAdmin(payload: CreateAdminDto){
    const adminExists = await this.prisma.user.findFirst({
      where: {
        OR: [
          {phone: payload.phone},
          {email: payload.email}
        ]
      }
    })
    
    if(adminExists) throw new ConflictException()
      const hashPass = await bcrypt.hash(payload.password, 10)
    await this.prisma.user.create({
      data: {
        // first_name: payload.first_name,
        // last_name: payload.last_name,
        // phone: payload.phone,
        // email: payload.email,
        ...payload,
        role: "ADMIN",
        password: hashPass
      }
    })

    return{
      success: true,
      message: "create admin successfully"
    }
  }


  async updateAdmin(id: number, payload: UpdateAdminDto) {
  const admin = await this.prisma.user.findUnique({
    where: { id },
  });

  if (!admin) {
    throw new NotFoundException('Admin topilmadi');
  }

  return this.prisma.user.update({
    where: { id },
    data: {
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
    },
  });
  }



  async deleteAdmin(id: number) {

  const admin = await this.prisma.user.findUnique({
    where: { id },
  });

  if (!admin) {
    throw new NotFoundException('Admin topilmadi');
  }

  await this.prisma.user.delete({
    where: { id },
  });

  return {
    success: true,
    message: 'deleted'
  }
}
}
