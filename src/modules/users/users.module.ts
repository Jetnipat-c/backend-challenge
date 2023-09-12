import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Companies, Users } from 'src/database';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Companies])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
