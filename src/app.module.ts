import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './infra/auth/auth.module';
import { CloudstackModule } from './infra/cloudstack/cloudstack.module';
import { DomainRepositoryModule } from './infra/db/postgres/domain/domain-repository.module';
import { CreateUserAdmin } from './presentation/user/create-user-admin/create-user-admin.module';
import { GetUserModule } from './presentation/user/get-user/get-user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CloudstackModule,
    AuthModule,
    CreateUserAdmin,
    GetUserModule,
    DomainRepositoryModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
