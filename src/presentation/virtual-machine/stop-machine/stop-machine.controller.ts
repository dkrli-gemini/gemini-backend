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
import { PrismaService } from 'src/infra/db/prisma.service';
import { InvalidParamError } from 'src/domain/errors/invalid-param.error';
import { throwsException } from 'src/utilities/exception';

@Controller('machines')
export class StopMachineController
  implements IController<StopMachineInputDto, StopMachineOutputDto>
{
  constructor(
    private readonly cloudstackService: CloudstackService,
    private readonly jobRepository: IJobRepository,
    private readonly machineRepository: IVirtualMachineRepository,
    private readonly prisma: PrismaService,
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
    const machineContext = await this.prisma.virtualMachineModel.findUnique({
      where: { id: machine.id },
      select: {
        id: true,
        project: {
          select: {
            domain: {
              select: {
                name: true,
                cloudstackAccountId: true,
              },
            },
          },
        },
      },
    });

    const domain = machineContext?.project?.domain;
    const cloudstackDomainId = await this.resolveCloudstackDomainId(
      domain?.name,
      domain?.cloudstackAccountId,
    );

    const csResponse = await this.cloudstackService.handle({
      command: CloudstackCommands.VirtualMachine.StopMachine,
      additionalParams: {
        id: machine.id,
        ...(domain?.name ? { account: domain.name } : {}),
        ...(cloudstackDomainId ? { domainid: cloudstackDomainId } : {}),
      },
    });
    const response = csResponse?.stopvirtualmachineresponse;
    if (!response?.jobid) {
      const errorMessage =
        response?.errortext ??
        csResponse?.error?.response?.headers?.['x-description'] ??
        'Falha ao desligar máquina no CloudStack.';
      throwsException(new InvalidParamError(errorMessage));
    }

    await this.machineRepository.setStatus(machine.id, 'STOPPING');
    const createdJob = await this.jobRepository.createJob({
      id: response.jobid,
      status: JobStatusEnum.PENDING,
      type: JobTypeEnum.StopVM,
      entityId: input.machineId,
    });
    return ok(new StopMachineOutputDto(createdJob.id));
  }

  private async resolveCloudstackDomainId(
    accountName?: string | null,
    cloudstackAccountId?: string | null,
  ): Promise<string | null> {
    if (!accountName && !cloudstackAccountId) {
      return null;
    }

    const listAccountsResponse = await this.cloudstackService.handle({
      command: CloudstackCommands.Account.ListAccounts,
      additionalParams: cloudstackAccountId
        ? { id: cloudstackAccountId }
        : { name: accountName as string },
    });

    const accounts = listAccountsResponse?.listaccountsresponse?.account;
    const account = Array.isArray(accounts) ? accounts[0] : accounts;
    return account?.domainid ? String(account.domainid) : null;
  }
}
