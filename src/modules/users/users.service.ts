import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create.admin.dto';
import bcrypt from "bcrypt"
import { PrismaService } from 'src/core/database/prisma.service';


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService){}

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
}
