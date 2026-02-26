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
import { PrismaService } from 'src/infra/db/prisma.service';
import { InvalidParamError } from 'src/domain/errors/invalid-param.error';
import { throwsException } from 'src/utilities/exception';

@Controller('machines')
export class TurnOnMachineController
  implements IController<TurnOnMachineInputDto, TurnOnMachineOutputDto>
{
  constructor(
    private readonly cloudstackService: CloudstackService,
    private readonly jobRepository: IJobRepository,
    private readonly machineRepository: IVirtualMachineRepository,
    private readonly prisma: PrismaService,
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
      command: CloudstackCommands.VirtualMachine.StartMachine,
      additionalParams: {
        id: machine.id,
        ...(domain?.name ? { account: domain.name } : {}),
        ...(cloudstackDomainId ? { domainid: cloudstackDomainId } : {}),
      },
    });
    const response = csResponse?.startvirtualmachineresponse;
    if (!response?.jobid) {
      const errorMessage =
        response?.errortext ??
        csResponse?.error?.response?.headers?.['x-description'] ??
        'Falha ao iniciar máquina no CloudStack.';
      throwsException(new InvalidParamError(errorMessage));
    }

    await this.machineRepository.setStatus(machine.id, 'STARTING');
    const createdJob = await this.jobRepository.createJob({
      id: response.jobid,
      status: JobStatusEnum.PENDING,
      type: JobTypeEnum.StartVM,
      entityId: input.machineId,
    });
    return ok(new TurnOnMachineOutputDto(createdJob.id));
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
