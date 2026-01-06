import { Injectable, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IAddVolume,
  IAddVolumeInput,
  IAddVolumeOutput,
} from 'src/domain/contracts/use-cases/instance/add-volume';
import { JobStatusEnum, JobTypeEnum } from 'src/domain/entities/job';
import { IVolumeOffer } from 'src/domain/entities/volume-offer';
import { InvalidParamError } from 'src/domain/errors/invalid-param.error';
import { IJobRepository } from 'src/domain/repository/job.repository';
import { IVirtualMachineRepository } from 'src/domain/repository/virtual-machine.repository';
import { IVolumeOfferRepository } from 'src/domain/repository/volume-offer.repository';
import { IVolumeRepository } from 'src/domain/repository/volume.repository';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';
import { PrismaService } from 'src/infra/db/prisma.service';
import { BillingService } from 'src/data-layer/services/billing/billing.service';
import { ResourceTypeEnum } from 'src/domain/entities/resource-limit';

@Injectable()
export class AddVolume implements IAddVolume {
  private ZONE_ID: string;

  constructor(
    private readonly volumeRepository: IVolumeRepository,
    private readonly machineRepository: IVirtualMachineRepository,
    private readonly diskOfferRepository: IVolumeOfferRepository,
    private readonly cloudstack: CloudstackService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jobRepository: IJobRepository,
    private readonly billingService: BillingService,
  ) {
    this.ZONE_ID = this.configService.get<string>('CLOUDSTACK_DEFAULT_ZONE_ID');
  }

  async execute(input: IAddVolumeInput): Promise<IAddVolumeOutput> {
    this.validateInput(input);
    const offer = await this.diskOfferRepository.getOffer(input.offerId);
    const project = await this.prisma.projectModel.findUnique({
      where: {
        id: input.projectId,
      },
    });
    const domain = await this.prisma.domainModel.findUnique({
      where: {
        id: project.domainId,
      },
    });

    const diskJob = (
      await this.cloudstack.handle({
        command: CloudstackCommands.Volume.CreateVolume,
        additionalParams: {
          domainid: domain.id,
          account: domain.name,
          name: input.name,
          diskofferingid: offer.id,
          size: input.sizeInGb.toString(),
          zoneid: this.ZONE_ID,
        },
      })
    ).createvolumeresponse;

    console.log(diskJob);
    await this.jobRepository.createJob({
      id: diskJob.jobid,
      status: JobStatusEnum.PENDING,
      type: JobTypeEnum.AttachVolume,
      entityId: `${diskJob.id}|${input.machineId}`,
    });

    const volumeCreated = await this.volumeRepository.createVolume({
      id: diskJob.id,
      machineId: input.machineId,
      name: input.name,
      sizeInGb: input.sizeInGb,
      offer: {
        id: input.offerId,
      } as IVolumeOffer,
    });

    await this.billingService.registerUsage({
      domainId: domain.id,
      projectId: input.projectId,
      consumptions: [
        {
          resourceId: volumeCreated.id,
          resourceType: ResourceTypeEnum.VOLUMES,
          quantity: input.sizeInGb,
          description: `Volume ${input.name}`,
          metadata: {
            sizeInGb: input.sizeInGb,
            offerId: input.offerId,
          },
          virtualMachineId: input.machineId,
        },
      ],
    });

    return {
      created: true,
      volumeId: volumeCreated.id,
    };
  }

  private validateInput(input: IAddVolumeInput) {
    if (!Number.isFinite(input.sizeInGb) || input.sizeInGb <= 0) {
      throw new InvalidParamError('sizeInGb must be greater than zero');
    }
  }
}

export const AddVolumeProvider: Provider = {
  provide: IAddVolume,
  useClass: AddVolume,
};
