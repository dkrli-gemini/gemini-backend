import { Module } from '@nestjs/common';
import { CloudstackModule } from '../cloudstack/cloudstack.module';
import { JobPollingService } from './job-polling';
import { JobRepositoryModule } from '../db/postgres/job/job-repository.module';
import { VirtualMachineRepositoryModule } from '../db/postgres/virtual-machine/virtual-machine-repository.module';
import { PrismaModule } from '../db/prisma.module';
import { JobController } from './job.controller';
import { JOB_HANDLER_MAP } from './job.constants';
import { StartVmJobHandler } from './handlers/start-vm-job.handler';
import { StopVmJobHandler } from './handlers/stop-vm-job.handler';
import { AttachVolumeJobHandler } from './handlers/attach-volume-job.handler';
import { AttachIpJobHandler } from './handlers/attach-ip-job.handler';
import { CreateVmJobHandler } from './handlers/create-vm-job.handler';
import { JobHandler } from './handlers/job-handler';
import { JobTypeEnum } from 'src/domain/entities/job';

const jobHandlerProviders = [
  StartVmJobHandler,
  StopVmJobHandler,
  AttachVolumeJobHandler,
  AttachIpJobHandler,
  CreateVmJobHandler,
];

@Module({
  imports: [
    CloudstackModule,
    JobRepositoryModule,
    VirtualMachineRepositoryModule,
    PrismaModule,
  ],
  providers: [
    ...jobHandlerProviders,
    {
      provide: JOB_HANDLER_MAP,
      useFactory: (...handlers: JobHandler[]) => {
        const handlerMap = new Map<JobTypeEnum, JobHandler>();

        handlers.forEach((handler) => {
          handlerMap.set(handler.type, handler);
        });

        return handlerMap;
      },
      inject: jobHandlerProviders,
    },
    JobPollingService,
  ],
  exports: [JobPollingService],
  controllers: [JobController],
})
export class JobsModule {}
