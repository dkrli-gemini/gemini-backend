import { Injectable, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IAddVirtualMachine,
  IAddVirtualMachineInput,
  IAddVirtualMachineOutput,
} from 'src/domain/contracts/use-cases/project/add-virtual-machine';
import { IInstance } from 'src/domain/entities/instance';
import { JobStatusEnum, JobTypeEnum } from 'src/domain/entities/job';
import { INetwork } from 'src/domain/entities/network';
import { IProject } from 'src/domain/entities/project';
import { ITemplate } from 'src/domain/entities/template';
import { InvalidParamError } from 'src/domain/errors/invalid-param.error';
import { IInstanceRepository } from 'src/domain/repository/instance.repository';
import { IJobRepository } from 'src/domain/repository/job.repository';
import { INetworkRepository } from 'src/domain/repository/network.repository';
import { IProjectRepository } from 'src/domain/repository/project.repository';
import { IVirtualMachineRepository } from 'src/domain/repository/virtual-machine.repository';
import { BillingService } from 'src/data-layer/services/billing/billing.service';
import { ResourceTypeEnum } from 'src/domain/entities/resource-limit';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';
import { PrismaService } from 'src/infra/db/prisma.service';
import { throwsException } from 'src/utilities/exception';

@Injectable()
export class AddVirtualMachine implements IAddVirtualMachine {
  private defaultZoneId: string;
  private customNvmeOfferingId: string;
  private customHddOfferingId: string;

  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly cloudstackService: CloudstackService,
    private readonly configService: ConfigService,
    private readonly networkRepository: INetworkRepository,
    private readonly virtualMachineRepository: IVirtualMachineRepository,
    private readonly instanceRepository: IInstanceRepository,
    private readonly jobRepository: IJobRepository,
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService,
  ) {
    this.defaultZoneId = this.configService.get<string>(
      'CLOUDSTACK_DEFAULT_ZONE_ID',
    );
    this.customNvmeOfferingId = this.configService.get<string>(
      'CLOUDSTACK_CUSTOM_COMPUTE_OFFER_NVME_ID',
    );
    this.customHddOfferingId = this.configService.get<string>(
      'CLOUDSTACK_CUSTOM_COMPUTE_OFFER_HDD_ID',
    );
  }

  async execute(
    input: IAddVirtualMachineInput,
  ): Promise<IAddVirtualMachineOutput> {
    await this.validate(input);

    const project = await this.projectRepository.getProject(input.projectId);
    const network = await this.networkRepository.getNetwork(input.networkId);
    if (!network) {
      throwsException(new InvalidParamError('Rede não encontrada.'));
    }
    const offer = await this.instanceRepository.getInstance(input.offerId);
    this.ensureOfferHasSpecs(offer);
    const foundTemplate = await this.prisma.templateOfferModel.findUnique({
      where: { id: input.templateId },
    });
    const domain = await this.prisma.domainModel.findUnique({
      where: {
        id: project.domain.id,
      },
      include: {
        vpc: true,
      },
    });
    const cloudstackDomainId = await this.resolveCloudstackDomainId(domain);

    const jobResponse = await this.cloudstackService.handle({
      command: CloudstackCommands.VirtualMachine.DeployVirtualMachine,
      additionalParams: {
        serviceofferingid: this.resolveServiceOfferingId(offer),
        startvm: 'false',
        templateid: foundTemplate.id,
        zoneid: input.zoneId ?? this.defaultZoneId,
        domainid: cloudstackDomainId,
        account: project.domain.name,
        name: input.name,
        networkids: network.id,
        'details[0].cpuNumber': offer.cpuNumber.toString(),
        'details[0].cpuSpeed': offer.cpuSpeedMhz.toString(),
        'details[0].memory': offer.memoryInMb.toString(),
        rootdisksize: offer.rootDiskSizeInGb.toString(),
      },
    });

    const virtualMachineCreated =
      await this.virtualMachineRepository.createVirtualMachine({
        network: {
          id: network.id,
        } as INetwork,
        instance: {
          id: offer.id,
        } as IInstance,
        template: {
          id: foundTemplate.id,
          name: foundTemplate.name,
        } as ITemplate,
        id: jobResponse.deployvirtualmachineresponse.id,
        ipAddress: '',
        name: input.name,
        cpuNumber: offer.cpuNumber,
        cpuSpeedMhz: offer.cpuSpeedMhz,
        memoryInMb: offer.memoryInMb,
        rootDiskSizeInGb: offer.rootDiskSizeInGb,
        project: {
          id: input.projectId,
        } as IProject,

        state: 'STOPPED',
      });

    await this.jobRepository.createJob({
      id: jobResponse.deployvirtualmachineresponse.jobid,
      status: JobStatusEnum.PENDING,
      type: JobTypeEnum.CreateVM,
      entityId: virtualMachineCreated.id,
    });

    await this.billingService.registerUsage({
      domainId: project.domain.id,
      projectId: project.id,
      consumptions: [
        {
          resourceId: virtualMachineCreated.id,
          resourceType: ResourceTypeEnum.CPU,
          quantity: offer.cpuNumber,
          description: `CPU para ${input.name}`,
          metadata: {
            cpuNumber: offer.cpuNumber,
            cpuSpeedMhz: offer.cpuSpeedMhz,
          },
          virtualMachineId: virtualMachineCreated.id,
          billable: false,
        },
        {
          resourceId: virtualMachineCreated.id,
          resourceType: ResourceTypeEnum.MEMORY,
          quantity: offer.memoryInMb,
          description: `Memória para ${input.name}`,
          metadata: {
            memoryInMb: offer.memoryInMb,
          },
          virtualMachineId: virtualMachineCreated.id,
          billable: false,
        },
        {
          resourceId: virtualMachineCreated.id,
          resourceType: ResourceTypeEnum.VOLUMES,
          quantity: offer.rootDiskSizeInGb,
          description: `Disco raiz ${input.name}`,
          metadata: {
            rootDiskSizeInGb: offer.rootDiskSizeInGb,
            isRoot: true,
          },
          virtualMachineId: virtualMachineCreated.id,
          billable: false,
        },
        {
          resourceId: virtualMachineCreated.id,
          resourceType: ResourceTypeEnum.INSTANCES,
          quantity: 1,
          description: `Máquina virtual ${input.name}`,
          metadata: {
            offerId: offer.id,
            offerName: offer.name,
            cpuNumber: offer.cpuNumber,
            cpuSpeedMhz: offer.cpuSpeedMhz,
            memoryInMb: offer.memoryInMb,
            rootDiskSizeInGb: offer.rootDiskSizeInGb,
          },
          virtualMachineId: virtualMachineCreated.id,
        },
      ],
    });

    const output: IAddVirtualMachineOutput = {
      id: virtualMachineCreated.id,
      jobId: jobResponse.deployvirtualmachineresponse.jobid,
    };
    return output;
  }

  private async validate(input: IAddVirtualMachineInput) {
    // TODO: validate limits

    const isNameDuplicate =
      (await this.prisma.virtualMachineModel.findFirst({
        where: {
          name: input.name,
          projectId: input.projectId,
        },
      })) != null;

    if (isNameDuplicate) {
      throwsException(
        new InvalidParamError('A machine with this name already exists'),
      );
    }
  }

  private ensureOfferHasSpecs(offer: IInstance) {
    const numericFields = [
      { value: offer.cpuNumber, label: 'CPU cores' },
      { value: offer.cpuSpeedMhz, label: 'CPU speed' },
      { value: offer.memoryInMb, label: 'memory' },
      { value: offer.rootDiskSizeInGb, label: 'root disk size' },
    ];

    for (const field of numericFields) {
      if (!Number.isFinite(field.value) || field.value <= 0) {
        throwsException(
          new InvalidParamError(
            `Offer specification "${field.label}" must be greater than zero`,
          ),
        );
      }
    }
  }

  private resolveServiceOfferingId(offer: IInstance): string {
    const tier = offer.diskTier?.toUpperCase();
    if (tier === 'HDD' && this.customHddOfferingId) {
      return this.customHddOfferingId;
    }
    if (tier === 'NVME' && this.customNvmeOfferingId) {
      return this.customNvmeOfferingId;
    }

    return this.customNvmeOfferingId ?? this.customHddOfferingId ?? offer.id;
  }

  private async resolveCloudstackDomainId(domain: {
    id: string;
    name: string;
    cloudstackAccountId?: string | null;
  }): Promise<string> {
    const listAccountsResponse = await this.cloudstackService.handle({
      command: CloudstackCommands.Account.ListAccounts,
      additionalParams: domain.cloudstackAccountId
        ? { id: domain.cloudstackAccountId }
        : { name: domain.name },
    });

    const accounts = listAccountsResponse?.listaccountsresponse?.account;
    const account = Array.isArray(accounts) ? accounts[0] : accounts;
    const cloudstackDomainId = account?.domainid;

    if (!cloudstackDomainId) {
      throwsException(
        new InvalidParamError(
          'Não foi possível resolver o domainid no CloudStack para deploy da VM.',
        ),
      );
    }

    return String(cloudstackDomainId);
  }
}

export const AddVirtualMachineProvider: Provider = {
  provide: IAddVirtualMachine,
  useClass: AddVirtualMachine,
};
