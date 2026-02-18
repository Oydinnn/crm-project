import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateRoomDto } from './dto/create.room.dto';
import { UpdateRoomDto } from './dto/update.room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService){}

  async getAllRooms(){
    const rooms = await this.prisma.room.findMany({
      where: { status: 'active' }
    })

    return {
      success: true,
      data: rooms
    }
  }

  async createRoom(payload: CreateRoomDto){
    const existRoom = await this.prisma.room.findUnique({
      where:{name: payload.name}
    })

    if(existRoom) throw new ConflictException('Room already exists')
    await this.prisma.room.create({
      data: payload
    })

    return{
      success: true,
      message: "Room created"
    }
  }

  async updateRoom(id: number, payload: UpdateRoomDto) {
    const room = await this.prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException('room topilmadi');
    }

    return this.prisma.room.update({
      where: { id },
      data: {
        name: payload.name,
      },
    });
  }

  async deleteRoom(id: number) {
    const room = await this.prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException('room topilmadi');
    }

    await this.prisma.room.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'room deleted',
    };
  }
}
