import { Controller, Get, Param } from '@nestjs/common';
import { AuthorizedTo } from '../auth/auth.decorator';
import { RolesEnum } from '../auth/roles.guard';
import { IJobRepository } from 'src/domain/repository/job.repository';
import { ok } from 'src/domain/contracts/http';
import { JobStatusEnum } from 'src/domain/entities/job';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobRepository: IJobRepository) {}

  @AuthorizedTo(RolesEnum.BASIC, RolesEnum.ADMIN)
  @Get('status/:id')
  async getJobStatus(@Param('id') jobId: string) {
    const job = await this.jobRepository.getJob(jobId);
    if (!job) {
      return ok({ status: JobStatusEnum.FAILED, error: 'Job not found' });
    }

    return ok({ status: job.status, error: job.error });
  }
}
