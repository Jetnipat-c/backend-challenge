import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './data-source';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig)],
})
export class DatabaseModule {}
