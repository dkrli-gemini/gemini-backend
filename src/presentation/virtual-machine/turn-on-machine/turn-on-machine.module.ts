import { Module } from '@nestjs/common';
import { TurnOnMachineController } from './turn-on-machine.controller';
import { CloudstackModule } from 'src/infra/cloudstack/cloudstack.module';
import { JobRepositoryModule } from 'src/infra/db/postgres/job/job-repository.module';
import { VirtualMachineRepositoryModule } from 'src/infra/db/postgres/virtual-machine/virtual-machine-repository.module';

@Module({
  imports: [
    CloudstackModule,
    JobRepositoryModule,
    VirtualMachineRepositoryModule,
  ],
  controllers: [TurnOnMachineController],
})
export class TurnOnMachineModule {}
