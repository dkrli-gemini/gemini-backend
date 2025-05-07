import { Module } from '@nestjs/common';
import { CloudstackModule } from '../cloudstack/cloudstack.module';
import { JobPollingService } from './job-polling';
import { JobRepositoryModule } from '../db/postgres/job/job-repository.module';
import { VirtualMachineRepositoryModule } from '../db/postgres/virtual-machine/virtual-machine-repository.module';
import { PrismaModule } from '../db/prisma.module';

@Module({
  imports: [
    CloudstackModule,
    JobRepositoryModule,
    VirtualMachineRepositoryModule,
    PrismaModule,
  ],
  providers: [JobPollingService],
  exports: [JobPollingService],
})
export class JobsModule {}
