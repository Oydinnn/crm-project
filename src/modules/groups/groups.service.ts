import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateGroupDto } from './dto/create.group.dto';
import { UpdateGroupDto } from './dto/update.group.dto';
import { Status } from '@prisma/client';
import { FilterDto} from './dto/search.group.dto';
import { PaginationDto } from '../students/dto/pagination.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async getGroupOne(groupId: number) {
    const existGroup = await this.prisma.group.findFirst({
      where: {
        id: groupId,
        status: Status.active,
      },
    });
    if (!existGroup)
      throw new NotFoundException('Group not found with this id');

    const groupStudents = await this.prisma.studentGroup.findMany({
      where: {
        group_id: groupId,
        status: Status.active,
      },
      select: {
        student: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            phone: true,
            email: true,
            photo: true,
            birth_date: true,
            created_at: true,
          },
        },
      },
    });
    const dataFormatter = groupStudents.map((el) => el.student);
    return {
      success: true,
      data: dataFormatter,
    };
  }

  async getAllGroups(search:FilterDto, pageination: PaginationDto) {
    const {page = 1, limit = 10} = pageination
    const {groupName, max_student} = search

    let searchWhere = {
      status: Status.active
    }

    if(groupName){
      searchWhere["name"] = groupName
    }

    if(max_student){
      searchWhere["max_student"] = +max_student
    }
    
    const groups = await this.prisma.group.findMany({
      where:searchWhere,
      select: {
        id: true,
        name: true,
        max_student: true,
        start_date: true,
        start_time: true,
        week_day: true,

        course: {
          select: {
            id: true,
            name: true,
          },
        },
        room: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            first_name: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit
    });

    return {
      success: true,
      data: groups,
    };
  }

  async createGroup(payload: CreateGroupDto){
    // helper
    const timeToMinute = (time: string)=>{
      const [h, m] = time.split(":").map(Number)
      return h * 60 + m
    }
// check room
    const existRoom = await this.prisma.room.findFirst({
      where:{
        id: payload.room_id,
        status: Status.active
      }
    })

    if(!existRoom) throw new NotFoundException('Room is not found with this id')
// check course
    const existCourse = await this.prisma.course.findFirst({
      where:{
        id: payload.course_id,
        status: Status.active
      }
    })

    if(!existCourse) throw new NotFoundException("Course is not found or inactive with this id")
// check teacher
    const existTeacher = await this.prisma.teacher.findFirst({
      where: {
        id: payload.teacher_id,
        status: Status.active
      }
    })
    if(!existTeacher) throw new NotFoundException("Teacher is not founded  with this id")
// check group name
    const existGroup = await this.prisma.group.findUnique({
      where: {name: payload.name}
    })

    if(existGroup) throw new ConflictException("Group already exists")
// time calculate
    const startNew = timeToMinute(payload.start_time)
    const endNew = startNew + existCourse.duration_hours * 60
// check room
    const roomGroups = await this.prisma.group.findMany({
      where: {
        room_id: payload.room_id,
        status: Status.active
      },
      select: {
        start_time: true,
        course: {
          select:{
            duration_hours: true
          }
        }
      }
    })

    const isRoomBusy = roomGroups.some(el =>{
      const start = timeToMinute(el.start_time)
      const end = start + el.course.duration_hours * 60

      return start < endNew && end > startNew
    })



    if(!isRoomBusy) throw new ConflictException('Room is busy at this time')

    const newGroup = await this.prisma.group.create({
      data:{
        ...payload,
        start_date: new Date(payload.start_date),
      }
    })

    return{
      success: true,
      message: "Group created succesfully",
      data: newGroup
    }

  }



  // async createGroup(payload: CreateGroupDto) {
  //   const existRoom = await this.prisma.room.findFirst({
  //     where: {
  //       id: payload.room_id,
  //       status: Status.active,
  //     },
  //   });

  //   if (!existRoom)
  //     throw new NotFoundException('Room is not found with this id');

  //   const existsRoomGroups = await this.prisma.group.findMany({
  //     where: {
  //       room_id: payload.room_id,
  //       status: Status.active,
  //     },
  //     select: {
  //       start_time:true,
  //       course: {
  //         select: {
  //           duration_hours: true,
  //         },
  //       },
  //     },
  //   });

  //    const existCourse = await this.prisma.course.findFirst({
  //     where: {
  //       id: payload.course_id,
  //       status: Status.active,
  //     },
  //   });

  //   if (!existCourse)
  //     throw new NotFoundException(
  //       'Course is not found or inactive with this id',
  //     );


  //   let start_minut_newGroup = Number(payload.start_time.split(":")[0]) * 60 + Number(payload.start_time.split(":")[1])
  //   let end_minut_newGroup = Number(payload.start_time.split(":")[0]) * 60 + Number(payload.start_time.split(":")[1]) + existCourse.duration_hours * 60


  //   const busyRoomTime = existsRoomGroups.some(el=>{
  //     let start_minut = Number(el.start_time.split(":")[0]) * 60 + Number(el.start_time.split(":")[1])
  //     let end_minut = Number(el.start_time.split(":")[0]) * 60 + Number(el.start_time.split(":")[1]) + el.course.duration_hours * 60


  //       return start_minut < end_minut_newGroup && end_minut < start_minut_newGroup




  //     // if(
  //     //   (start_minut <= start_minut_newGroup && end_minut > start_minut_newGroup) ||
  //     //   (start_minut > end_minut_newGroup && end_minut <= end_minut_newGroup)
  //     // ) {
  //     //   return false
  //     // }
  //       // return true



  //     // return [start_minut, end_minut]
  //   })
  //   console.log(start_minut_newGroup, end_minut_newGroup);

  //   console.log(busyRoomTime);

    

  //   const existTeacher = await this.prisma.teacher.findFirst({
  //     where: {
  //       id: payload.teacher_id,
  //       status: Status.active,
  //     },
  //   });

  //   if (!existTeacher)
  //     throw new NotFoundException('Teacher is not found with this id');

  //   const existGroup = await this.prisma.group.findUnique({
  //     where: { name: payload.name },
  //   });

  //   if (existGroup) throw new ConflictException('group already exists');

  //   // await this.prisma.group.create({
  //   //   data: {
  //           // ...payload,
  //           // start_date: new Date(payload.start_date)



  //   //     name: payload.name,
  //   //     desc: payload.desc,
  //   //     course_id: payload.course_id,
  //   //     teacher_id: payload.teacher_id,
  //   //     room_id: payload.room_id,
  //   //     start_date: new Date(payload.start_date),
  //   //     week_day: payload.week_day,
  //   //     start_time: payload.start_time,
  //   //     max_student: payload.max_student,
  //   //     status: payload.status ?? 'active',
  //   //   },
  //   // });

  //   return {
  //     success: true,
  //     message: 'group created',
  //   };
  // }

  async updateGroup(id: number, payload: UpdateGroupDto) {
    const group = await this.prisma.group.findUnique({
      where: { id },
    });

    if (!group) {
      throw new NotFoundException('group topilmadi');
    }

    return this.prisma.group.update({
      where: { id },
      data: {
        name: payload.name,
        desc: payload.desc,
        course_id: payload.course_id,
        teacher_id: payload.teacher_id,
        room_id: payload.room_id,
        start_date: payload.start_date
          ? new Date(payload.start_date)
          : undefined,
        week_day: payload.week_day,
        start_time: payload.start_time,
        max_student: payload.max_student,
        status: payload.status,
      },
    });
  }

  async deleteGroup(id: number) {
    const group = await this.prisma.group.findUnique({
      where: { id },
    });

    if (!group) {
      throw new NotFoundException('group topilmadi');
    }

    await this.prisma.group.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'group deleted',
    };
  }
}
