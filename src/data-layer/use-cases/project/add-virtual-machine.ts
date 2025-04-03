import { Injectable, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IAddVirtualMachine,
  IAddVirtualMachineInput,
} from 'src/domain/contracts/use-cases/project/add-virtual-machine';
import { IProject } from 'src/domain/entities/project';
import { IVirtualMachine } from 'src/domain/entities/virtual-machine';
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
  ) {
    this.defaultZoneId = this.configService.get<string>(
      'CLOUDSTACK_DEFAULT_ZONE_ID',
    );
  }

  async execute(input: IAddVirtualMachineInput): Promise<IVirtualMachine> {
    const project = await this.projectRepository.getProject(input.projectId);
    const network = await this.networkRepository.getNetwork(input.networkId);
    console.log(network);

    const jobResponse = await this.cloudstackService.handle({
      command: CloudstackCommands.VirtualMachine.DeployVirtualMachine,
      additionalParams: {
        serviceofferingid: input.cloudstackOfferId,
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
        cloudstackOfferId: input.cloudstackOfferId,
        cloudstackTemplateId: input.cloudstackTemplateId,
        ipAddress: '',
        name: input.name,
        os: template[0].name,
        project: {
          id: input.projectId,
        } as IProject,
        state: 'on',
      });

    return virtualMachineCreated;
  }
}

export const AddVirtualMachineProvider: Provider = {
  provide: IAddVirtualMachine,
  useClass: AddVirtualMachine,
};
