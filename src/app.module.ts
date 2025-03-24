import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './infra/auth/auth.module';
import { CloudstackModule } from './infra/cloudstack/cloudstack.module';
import { CreateUserAdmin } from './presentation/user/create-user-admin/create-user-admin.module';
import { GetUserModule } from './presentation/user/get-user/get-user.module';
// import { GetUserModule } from './presentation/user/get-user/get-user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CloudstackModule,
    AuthModule,
    CreateUserAdmin,
    GetUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
