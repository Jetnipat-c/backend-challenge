import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { FirebaseService } from './modules/firebase/firebase.service';
import { FirebaseAuthMiddleware } from './common/middleware/firebaseAuth.middleware';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseService],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FirebaseAuthMiddleware)
      .forRoutes({ path: 'api/v1/*', method: RequestMethod.ALL });
  }
}
