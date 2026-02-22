import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { CoursesModule } from './modules/courses/courses.module';
import { GroupsModule } from './modules/groups/groups.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { join } from 'path'
import { ServeStaticModule } from '@nestjs/serve-static';
import { LessonsModule } from './modules/lessons/lessons.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { HomeworkService } from './modules/homework/homework.service';
import { HomeworkModule } from './modules/homework/homework.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath:join(process.cwd(), "src","uploads"),
      serveRoot: "/files"
    }),
    ConfigModule.forRoot({
    isGlobal: true
  }),
    AuthModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    CoursesModule,
    GroupsModule,
    RoomsModule,
    LessonsModule,
    AttendanceModule,
    HomeworkModule,
  ],
  // controllers: [AppController],
  providers: [AuthService, HomeworkService],
})
export class AppModule {}
