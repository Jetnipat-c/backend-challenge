import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { QueryCompanyDto } from './dto/query-company.dto';
import { ImportUsersDto } from './dto/import-users.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.createCompany(createCompanyDto);
  }

  @Get()
  getAllCompanies(@Query() queryCompanyDto: QueryCompanyDto) {
    return this.companiesService.getAllCompanies(queryCompanyDto);
  }

  @Get(':id')
  getCompanyById(@Param('id') id: string) {
    return this.companiesService.getCompanyById(id);
  }

  @Patch(':id')
  updateCompany(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.updateCompany(id, updateCompanyDto);
  }

  @Delete(':id')
  deleteCompany(@Param('id') id: string) {
    return this.companiesService.deleteCompany(id);
  }

  @Post('import-employees')
  importEmployees(@Body() importUsersDto: ImportUsersDto) {
    return this.companiesService.importEmployees(importUsersDto);
  }
}
