import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AliasRole, Companies, Users } from 'src/database';
import { Repository } from 'typeorm';
import { QueryUserDto } from './dto/query-user.dto';
import { IPaginationMeta, paginate } from 'src/utils/paginate';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as admin from 'firebase-admin';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateClientAdminDto } from './dto/create-client-admin.dto';
import { CreateExpertDto } from './dto/create-expert.dto';
import { QueryExpertDto } from './dto/query-expert.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Companies)
    private readonly companiesRepo: Repository<Companies>,
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
  ) {}

  async getAllUsers(
    queryUserDto: QueryUserDto,
  ): Promise<IPaginationMeta<Users>> {
    const usersQueryBuilder = this.usersRepo.createQueryBuilder('users');
    if (queryUserDto.search_term) {
      usersQueryBuilder.where('users.name LIKE :name', {
        name: `%${queryUserDto.search_term}%`,
      });
    }
    return await paginate<Users>(usersQueryBuilder, queryUserDto);
  }

  private async createUser(createUserDto: CreateUserDto): Promise<Users> {
    try {
      const userRecord = await admin.auth().createUser({
        email: createUserDto.email,
        password: createUserDto.password,
        displayName: createUserDto.name,
      });

      if (userRecord.uid) {
        try {
          if (createUserDto.companyId) {
            const company = await this.companiesRepo.findOne({
              where: {
                id: createUserDto.companyId,
              },
            });

            if (!company) {
              throw new BadRequestException('Company not found');
            }

            const userDB = await this.usersRepo.create({
              ...createUserDto,
              refUid: userRecord.uid,
              company: company,
            });
            return await userDB.save();
          }

          const userDB = await this.usersRepo.create({
            ...createUserDto,
            refUid: userRecord.uid,
          });
          return await userDB.save();
        } catch (error) {
          await admin.auth().deleteUser(userRecord.uid);
          throw new BadRequestException(error.message);
        }
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<Users> {
    return await this.createUser({
      ...createEmployeeDto,
      role: AliasRole.EMPLOYEE,
      companyId: null,
    });
  }

  async createClientAdmin(
    createClientAdminDto: CreateClientAdminDto,
  ): Promise<Users> {
    return await this.createUser({
      ...createClientAdminDto,
      role: AliasRole.CLIENTADMIN,
    });
  }

  async createExpert(createExpertDto: CreateExpertDto): Promise<Users> {
    return await this.createUser({
      ...createExpertDto,
      role: AliasRole.EXPERT,
      companyId: null,
    });
  }

  async getAllEmployees(
    queryUserDto: QueryUserDto,
  ): Promise<IPaginationMeta<Users>> {
    const employeesQueryBuilder = this.usersRepo.createQueryBuilder('users');
    employeesQueryBuilder.where('users.role = :role', {
      role: AliasRole.EMPLOYEE,
    });
    return await paginate<Users>(employeesQueryBuilder, queryUserDto);
  }

  async getEmployeeById(id: string): Promise<Users> {
    return await this.usersRepo.findOne({
      where: {
        id,
        role: AliasRole.EMPLOYEE,
      },
    });
  }

  async getExpertById(id: string): Promise<Users> {
    return await this.usersRepo.findOne({
      where: {
        id,
        role: AliasRole.EXPERT,
      },
    });
  }

  async updateEmployee(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Users> {
    const employee = await this.getEmployeeById(id);
    if (!employee) {
      throw new BadRequestException('Employee not found');
    }

    await admin
      .auth()
      .updateUser(employee.refUid, { displayName: updateEmployeeDto.name });

    await this.usersRepo.update(id, updateEmployeeDto);
    return await this.usersRepo.findOne({
      where: {
        id: employee.id,
      },
    });
  }

  async deleteEmployee(id: string): Promise<void> {
    try {
      const employee = await this.usersRepo.findOne({
        where: { id },
      });
      if (!employee) {
        throw new BadRequestException('Employee not found');
      }
      await admin.auth().deleteUser(employee.refUid);
      await this.usersRepo.delete(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async searchExpert(params: QueryExpertDto): Promise<IPaginationMeta<Users>> {
    const { search_term } = params;
    const queryBuilder = this.usersRepo.createQueryBuilder('user');
    if (search_term) {
      queryBuilder.where('user.name LIKE :name', { name: `%${search_term}%` });
      queryBuilder.orWhere('user.email LIKE :email', {
        email: `%${search_term}%`,
      });
    }
    queryBuilder.andWhere('user.role = :role', { role: AliasRole.EXPERT });
    return await paginate<Users>(queryBuilder, params);
  }

  async getUserByRefUid(refUid: string): Promise<Users> {
    return await this.usersRepo.findOne({
      where: {
        refUid,
      },
      relations: ['company'],
    });
  }
}
