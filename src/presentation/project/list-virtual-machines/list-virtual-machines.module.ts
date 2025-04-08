import { Module } from '@nestjs/common';
import { ProjectRepositoryModule } from 'src/infra/db/postgres/project/project-repository.module';
import { VirtualMachineRepositoryModule } from 'src/infra/db/postgres/virtual-machine/virtual-machine-repository.module';
import { ListVirtualMachinesController } from './list-virtual-machines.controller';

@Module({
  imports: [VirtualMachineRepositoryModule],
  controllers: [ListVirtualMachinesController],
  providers: [],
  exports: [],
})
export class ListVirtualMachinesModule {}
