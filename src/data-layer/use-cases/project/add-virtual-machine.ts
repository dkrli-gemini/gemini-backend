import { Injectable, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IAddVirtualMachine,
  IAddVirtualMachineInput,
  IAddVirtualMachineOutput,
} from 'src/domain/contracts/use-cases/project/add-virtual-machine';
import { IInstance } from 'src/domain/entities/instance';
import { JobStatusEnum, JobTypeEnum } from 'src/domain/entities/job';
import { IProject } from 'src/domain/entities/project';
import { IInstanceRepository } from 'src/domain/repository/instance.repository';
import { IJobRepository } from 'src/domain/repository/job.repository';
import { INetworkRepository } from 'src/domain/repository/network.repository';
import { IProjectRepository } from 'src/domain/repository/project.repository';
import { IVirtualMachineRepository } from 'src/domain/repository/virtual-machine.repository';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';

@Injectable()
export class AddVirtualMachine implements IAddVirtualMachine {
  private defaultZoneId: string;

  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly cloudstackService: CloudstackService,
    private readonly configService: ConfigService,
    private readonly networkRepository: INetworkRepository,
    private readonly virtualMachineRepository: IVirtualMachineRepository,
    private readonly instanceRepository: IInstanceRepository,
    private readonly jobRepository: IJobRepository,
  ) {
    this.defaultZoneId = this.configService.get<string>(
      'CLOUDSTACK_DEFAULT_ZONE_ID',
    );
  }

  async execute(
    input: IAddVirtualMachineInput,
  ): Promise<IAddVirtualMachineOutput> {
    const project = await this.projectRepository.getProject(input.projectId);
    const network = await this.networkRepository.getNetwork(input.networkId);
    const instance = await this.instanceRepository.getInstance(
      input.instanceId,
    );

    const jobResponse = await this.cloudstackService.handle({
      command: CloudstackCommands.VirtualMachine.DeployVirtualMachine,
      additionalParams: {
        serviceofferingid: instance.cloudstackId,
        startvm: 'false',
        templateid: input.cloudstackTemplateId,
        zoneid: this.defaultZoneId,
        domainid: project.domain.cloudstackDomainId,
        account: project.domain.name,
        name: input.name,
        networkids: network.cloudstackId,
      },
    });

    console.log(jobResponse);

    const template = (
      await this.cloudstackService.handle({
        command: 'listTemplates',
        additionalParams: {
          templatefilter: 'all',
          id: input.cloudstackTemplateId,
        },
      })
    ).listtemplatesresponse.template;

    const virtualMachineCreated =
      await this.virtualMachineRepository.createVirtualMachine({
        instance: {
          id: instance.id,
        } as IInstance,
        cloudstackTemplateId: input.cloudstackTemplateId,
        cloudstackId: jobResponse.deployvirtualmachineresponse.id,
        ipAddress: '',
        name: input.name,
        os: template[0].name,
        project: {
          id: input.projectId,
        } as IProject,
        state: 'STOPPED',
      });

    await this.jobRepository.createJob({
      cloudstackJobId: jobResponse.deployvirtualmachineresponse.jobid,
      status: JobStatusEnum.PENDING,
      type: JobTypeEnum.CreateVM,
      entityId: virtualMachineCreated.id,
    });

    const output: IAddVirtualMachineOutput = {
      id: virtualMachineCreated.id,
      cloudstackId: jobResponse.deployvirtualmachineresponse.id,
      jobId: jobResponse.deployvirtualmachineresponse.jobid,
    };
    return output;
  }
}

export const AddVirtualMachineProvider: Provider = {
  provide: IAddVirtualMachine,
  useClass: AddVirtualMachine,
};
