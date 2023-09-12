import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { SeederOptions } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';

const configService = new ConfigService();

export const ormConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  synchronize: true,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
};

export const dataSource = new DataSource({
  ...ormConfig,
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  factories: ['src/database/factories/**/*{.ts,.js}'],
} as DataSourceOptions & SeederOptions);
