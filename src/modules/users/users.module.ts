import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/core/database/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UsersService,PrismaService]
})
export class UsersModule {}
