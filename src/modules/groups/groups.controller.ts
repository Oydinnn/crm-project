import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Search,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { Role } from '@prisma/client';
import { Authguard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { CreateGroupDto } from './dto/create.group.dto';
import { UpdateGroupDto } from './dto/update.group.dto';
import { FilterDto } from './dto/search.group.dto';
import { PaginationDto } from '../students/dto/pagination.dto';

@ApiBearerAuth()
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupService: GroupsService) {}

  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get('one/students:groupId')
  getGroupOne(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.groupService.getGroupOne(groupId);
  }



  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get("all")
  getAllGroups(
    @Query() search : FilterDto,
    @Query() pagination: PaginationDto
  ) {    
    return this.groupService.getAllGroups(search, pagination);
  }



  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Post()
  createGroup(@Body() payload: CreateGroupDto) {
    return this.groupService.createGroup(payload);
  }



  // UPDATE
  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Patch('group/:id')
  updateGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateGroupDto,
  ) {
    return this.groupService.updateGroup(id, payload);
  }

  // DELETE
  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
  })
  @UseGuards(Authguard, RoleGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Delete('group/:id')
  deleteGroup(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.deleteGroup(id);
  }
}
