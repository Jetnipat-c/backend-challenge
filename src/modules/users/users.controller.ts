import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryUserDto } from './dto/query-user.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateClientAdminDto } from './dto/create-client-admin.dto';
import { CreateExpertDto } from './dto/create-expert.dto';
import { QueryExpertDto } from './dto/query-expert.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(@Query() queryUserDto: QueryUserDto) {
    return this.usersService.getAllUsers(queryUserDto);
  }

  @Post('employee')
  createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.usersService.createEmployee(createEmployeeDto);
  }

  @Get('employee')
  getAllEmployees(@Query() queryUserDto: QueryUserDto) {
    return this.usersService.getAllEmployees(queryUserDto);
  }

  @Get('employee/:id')
  getEmployeeById(@Param('id') id: string) {
    return this.usersService.getEmployeeById(id);
  }

  @Patch('employee/:id')
  updateEmployee(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.usersService.updateEmployee(id, updateEmployeeDto);
  }

  @Delete('employee/:id')
  deleteEmployee(@Param('id') id: string) {
    return this.usersService.deleteEmployee(id);
  }

  @Post('client-admin')
  createClientAdmin(@Body() createClientAdminDto: CreateClientAdminDto) {
    return this.usersService.createClientAdmin(createClientAdminDto);
  }

  @Post('expert')
  createExpert(@Body() createExpertDto: CreateExpertDto) {
    return this.usersService.createExpert(createExpertDto);
  }

  @Get('expert')
  async searchExpert(@Query() queryParams: QueryExpertDto) {
    console.log(queryParams);
    return this.usersService.searchExpert(queryParams);
  }

  @Get('expert/:id')
  getExpertById(@Param('id') id: string) {
    return this.usersService.getExpertById(id);
  }

  @Get('find/:refUid')
  getUserByRefUid(@Param('refUid') refUid: string) {
    return this.usersService.getUserByRefUid(refUid);
  }
}
