/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { TurnOnMachineInputDto } from './dtos/turn-on-machine.input.dto';
import { TurnOnMachineOutputDto } from './dtos/turn-on-machine.output.dto';
import { Request } from 'express';
import {
  badRequest,
  created,
  IHttpResponse,
  ok,
} from 'src/domain/contracts/http';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';
import { IJobRepository } from 'src/domain/repository/job.repository';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { JobStatusEnum, JobTypeEnum } from 'src/domain/entities/job';
import { IVirtualMachineRepository } from 'src/domain/repository/virtual-machine.repository';

@Controller('machines')
export class TurnOnMachineController
  implements IController<TurnOnMachineInputDto, TurnOnMachineOutputDto>
{
  constructor(
    private readonly cloudstackService: CloudstackService,
    private readonly jobRepository: IJobRepository,
    private readonly machineRepository: IVirtualMachineRepository,
  ) {}

  @AuthorizedTo(RolesEnum.ADMIN, RolesEnum.BASIC)
  @Post('start-machine')
  async handle(
    @Body() input: TurnOnMachineInputDto,
    _req: Request,
    _projectId?: string,
  ): Promise<IHttpResponse<TurnOnMachineOutputDto | Error>> {
    const machine = await this.machineRepository.getMachine(input.machineId);
    if (machine.state == 'RUNNING') {
      return badRequest('Machine is already on');
    }
    const response = (
      await this.cloudstackService.handle({
        command: CloudstackCommands.VirtualMachine.StartMachine,
        additionalParams: {
          id: machine.id,
        },
      })
    ).startvirtualmachineresponse;
    console.log(response.jobid);
    await this.machineRepository.setStatus(machine.id, 'STARTING');
    const createdJob = await this.jobRepository.createJob({
      id: response.jobid,
      status: JobStatusEnum.PENDING,
      type: JobTypeEnum.StartVM,
      entityId: input.machineId,
    });
    return ok(new TurnOnMachineOutputDto(createdJob.id));
  }
}
