import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Companies, Users } from 'src/database';

@Module({
  imports: [TypeOrmModule.forFeature([Companies, Users])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
