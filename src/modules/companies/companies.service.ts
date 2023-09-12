import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Companies, Users } from 'src/database';
import { Repository } from 'typeorm';
import { IPaginationMeta, paginate } from 'src/utils/paginate';
import { QueryCompanyDto } from './dto/query-company.dto';
import { ImportUsersDto } from './dto/import-users.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Companies)
    private readonly companiesRepo: Repository<Companies>,
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
  ) {}

  async createCompany(createCompanyDto: CreateCompanyDto): Promise<Companies> {
    const company = await this.companiesRepo.findOne({
      where: { name: createCompanyDto.name },
    });
    console.log(company);
    if (company) {
      throw new BadRequestException('Company already exists');
    }
    return this.companiesRepo.save(createCompanyDto);
  }

  async getAllCompanies(
    queryCompanyDto: QueryCompanyDto,
  ): Promise<IPaginationMeta<Companies>> {
    const companiesQueryBuilder =
      this.companiesRepo.createQueryBuilder('companies');
    if (queryCompanyDto.search_term) {
      companiesQueryBuilder.where('companies.name LIKE :name', {
        name: `%${queryCompanyDto.search_term}%`,
      });
    }
    return await paginate<Companies>(companiesQueryBuilder, queryCompanyDto);
  }

  async getCompanyById(id: string): Promise<Companies> {
    try {
      const company = await this.companiesRepo.findOne({ where: { id } });
      return company;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateCompany(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Companies> {
    try {
      const company = await this.companiesRepo.findOne({
        where: { id },
      });
      if (!company) {
        throw new BadRequestException('Company not found');
      }

      return this.companiesRepo.save({
        ...company,
        ...updateCompanyDto,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteCompany(id: string): Promise<void> {
    try {
      const company = await this.companiesRepo.findOne({
        where: { id },
      });
      if (!company) {
        throw new BadRequestException('Company not found');
      }
      await this.companiesRepo.delete(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async importEmployees(importUsersDto: ImportUsersDto) {
    const { companyId, users } = importUsersDto;
    try {
      const company = await this.companiesRepo.findOne({
        where: { id: companyId },
      });
      if (!company) {
        throw new BadRequestException('Company not found');
      }
      users.map(async (user) => {
        const userRecord = await this.usersRepo.findOne({
          where: { email: user.email },
          relations: ['company'],
        });
        if (userRecord) {
          await this.usersRepo.save({
            ...user,
            company,
          });
        }
      });

      return { message: 'Imported successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
