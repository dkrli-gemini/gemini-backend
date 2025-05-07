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
import { GetDomainModule } from './presentation/domain/get-domain/get-domain.module';
import { AddNetworkModule } from './presentation/network/add-network/add-network.module';
import { AddVirtualMachineModule } from './presentation/project/add-virtual-machine/add-virtual-machine.module';
import { ListVirtualMachinesModule } from './presentation/project/list-virtual-machines/list-virtual-machines.module';
import { CreateUserAdmin } from './presentation/user/create-user-admin/create-user-admin.module';
import { GetUserModule } from './presentation/user/get-user/get-user.module';
import { GetUserProjectsModule } from './presentation/user/get-user-projects/get-user-projects.module';
import { GetMachineConsoleModule } from './presentation/project/get-machine-console/get-machine-console.module';
import { ListNetworksModule } from './presentation/project/list-networks/list-networks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsModule } from './infra/job/job.module';
import { TurnOnMachineModule } from './presentation/virtual-machine/turn-on-machine/turn-on-machine.module';
import { StopMachineModule } from './presentation/virtual-machine/stop-machine/stop-machine.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    JobsModule,
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
    AddVirtualMachineModule,
    GetDomainModule,
    ListVirtualMachinesModule,
    GetUserProjectsModule,
    GetMachineConsoleModule,
    ListNetworksModule,
    TurnOnMachineModule,
    StopMachineModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
