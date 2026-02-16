import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { CoursesModule } from './modules/courses/courses.module';
import { GroupsModule } from './modules/groups/groups.module';
import { RoomsModule } from './modules/rooms/rooms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true
  }),
    UsersModule,
    StudentsModule,
    TeachersModule,
    CoursesModule,
    GroupsModule,
    RoomsModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
