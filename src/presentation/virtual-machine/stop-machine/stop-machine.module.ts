import { Module } from '@nestjs/common';
import { StopMachineController } from './stop-machine.controller';
import { CloudstackModule } from 'src/infra/cloudstack/cloudstack.module';
import { JobRepositoryModule } from 'src/infra/db/postgres/job/job-repository.module';
import { VirtualMachineRepositoryModule } from 'src/infra/db/postgres/virtual-machine/virtual-machine-repository.module';

@Module({
  imports: [
    CloudstackModule,
    JobRepositoryModule,
    VirtualMachineRepositoryModule,
  ],
  controllers: [StopMachineController],
  providers: [],
  exports: [],
})
export class StopMachineModule {}
