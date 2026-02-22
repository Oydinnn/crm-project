import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { HomeworkService } from './homework.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateHomworkDto } from './dto/create.homework.dto';
import { Role } from '@prisma/client';
import { Authguard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { UpdateHomworkDto } from './dto/update.homework.dto';

@ApiBearerAuth()
@Controller('homework')
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  // get
  @ApiOperation({
    summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get()
  getAllHomworks() {
    return this.homeworkService.getAllHomework();
  }

  // create
  @ApiOperation({
    summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lesson_id: { type: 'number' },
        group_id: { type: 'number' },
        file: { type: 'string', format: 'binary' },
        title: { type: 'string' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/uploads/files',
        filename: (req, file, cb) => {
          const filename = Date.now() + '.' + file.mimetype.split('/')[1];
          cb(null, filename);
        },
      }),
    }),
  )
  @Post()
  createHomework(
    @Req() req: Request,
    @Body() payload: CreateHomworkDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.homeworkService.createHomework(
      req['user'],
      payload,
      file?.filename,
    );
  }

  // UPDATE
  @ApiOperation({
    summary: `${Role.TEACHER}, ${Role.ADMIN}`,
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        title: { type: 'string' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/uploads/files',
        filename: (req, file, cb) => {
          const filename = Date.now() + '.' + file.mimetype.split('/')[1];
          cb(null, filename);
        },
      }),
    }),
  )
  @Patch(':id')
  updateHomework(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Body() payload: UpdateHomworkDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.homeworkService.updateHomework(
      id,
      payload,
      req["user"],
      file?.filename,
    );
  }

  // DELETE STUDENT
  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Delete('homework/:id')
  deleteHomework(@Param('id', ParseIntPipe) id: number) {
    return this.homeworkService.deleteHomework(id);
  }
}
