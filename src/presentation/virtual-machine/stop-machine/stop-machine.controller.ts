/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { StopMachineInputDto } from './dtos/stop-machine.input.dto';
import { StopMachineOutputDto } from './dtos/stop-machine.output.dto';
import { Request } from 'express';
import { badRequest, IHttpResponse, ok } from 'src/domain/contracts/http';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';
import { IJobRepository } from 'src/domain/repository/job.repository';
import { IVirtualMachineRepository } from 'src/domain/repository/virtual-machine.repository';
import { JobStatusEnum, JobTypeEnum } from 'src/domain/entities/job';

@Controller('machines')
export class StopMachineController
  implements IController<StopMachineInputDto, StopMachineOutputDto>
{
  constructor(
    private readonly cloudstackService: CloudstackService,
    private readonly jobRepository: IJobRepository,
    private readonly machineRepository: IVirtualMachineRepository,
  ) {}

  @AuthorizedTo(RolesEnum.BASIC, RolesEnum.ADMIN)
  @Post('stop-machine')
  async handle(
    @Body() input: StopMachineInputDto,
    req: Request,
    projectId?: string,
  ): Promise<IHttpResponse<StopMachineOutputDto | Error>> {
    const machine = await this.machineRepository.getMachine(input.machineId);
    if (machine.state == 'STOPPED') {
      return badRequest('Machine is already stopped');
    }
    const response = (
      await this.cloudstackService.handle({
        command: CloudstackCommands.VirtualMachine.StopMachine,
        additionalParams: {
          id: machine.id,
        },
      })
    ).stopvirtualmachineresponse;
    await this.machineRepository.setStatus(machine.id, 'STOPPING');
    const createdJob = await this.jobRepository.createJob({
      id: response.jobid,
      status: JobStatusEnum.PENDING,
      type: JobTypeEnum.StopVM,
      entityId: input.machineId,
    });
    return ok(new StopMachineOutputDto(createdJob.id));
  }
}
