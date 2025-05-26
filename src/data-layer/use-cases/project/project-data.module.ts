import { Module } from '@nestjs/common';
import { CloudstackModule } from 'src/infra/cloudstack/cloudstack.module';
import { NetworkRepositoryModule } from 'src/infra/db/postgres/network/network-repository.module';
import { ProjectRepositoryModule } from 'src/infra/db/postgres/project/project-repository.module';
import { VirtualMachineRepositoryModule } from 'src/infra/db/postgres/virtual-machine/virtual-machine-repository.module';
import { AddVirtualMachineProvider } from './add-virtual-machine';
import { InstanceRepositoryModule } from 'src/infra/db/postgres/instance/instance-repository.module';
import { JobRepositoryModule } from 'src/infra/db/postgres/job/job-repository.module';

@Module({
  imports: [
    ProjectRepositoryModule,
    VirtualMachineRepositoryModule,
    CloudstackModule,
    NetworkRepositoryModule,
    InstanceRepositoryModule,
    JobRepositoryModule,
  ],
  providers: [AddVirtualMachineProvider],
  exports: [AddVirtualMachineProvider],
})
export class ProjectDataModule {}
