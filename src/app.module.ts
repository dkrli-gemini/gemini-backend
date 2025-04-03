import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DomainDataModule } from './data-layer/use-cases/domain/domain-data.module';
import { NetworkDataModule } from './data-layer/use-cases/network/network-data.module';
import { ProjectDataModule } from './data-layer/use-cases/project/project-data.module';
import { AuthModule } from './infra/auth/auth.module';
import { CloudstackModule } from './infra/cloudstack/cloudstack.module';
import { DomainRepositoryModule } from './infra/db/postgres/domain/domain-repository.module';
import { ProjectRepositoryModule } from './infra/db/postgres/project/project-repository.module';
import { CreateDomainAdmin } from './presentation/domain/create-domain-admin/create-domain-admin.module';
import { AddNetworkModule } from './presentation/network/add-network/add-network.module';
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
    DomainDataModule,
    CreateDomainAdmin,
    NetworkDataModule,
    AddNetworkModule,
    ProjectRepositoryModule,
    ProjectDataModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
