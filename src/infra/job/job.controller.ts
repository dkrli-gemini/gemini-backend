import { Controller, Get, Param } from '@nestjs/common';
import { AuthorizedTo } from '../auth/auth.decorator';
import { RolesEnum } from '../auth/roles.guard';
import { IJobRepository } from 'src/domain/repository/job.repository';
import { ok } from 'src/domain/contracts/http';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobRepository: IJobRepository) {}

  @AuthorizedTo(RolesEnum.BASIC, RolesEnum.ADMIN)
  @Get('status/:id')
  async getJobStatus(@Param('id') jobId: string) {
    const status = await this.jobRepository.getJobStatus(jobId);
    return ok({ status: status });
  }
}
