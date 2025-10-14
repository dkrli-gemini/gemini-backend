import { Injectable, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IAddVolume,
  IAddVolumeInput,
  IAddVolumeOutput,
} from 'src/domain/contracts/use-cases/instance/add-volume';
import { JobStatusEnum, JobTypeEnum } from 'src/domain/entities/job';
import { IVolumeOffer } from 'src/domain/entities/volume-offer';
import { IJobRepository } from 'src/domain/repository/job.repository';
import { IVirtualMachineRepository } from 'src/domain/repository/virtual-machine.repository';
import { IVolumeOfferRepository } from 'src/domain/repository/volume-offer.repository';
import { IVolumeRepository } from 'src/domain/repository/volume.repository';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';
import { PrismaService } from 'src/infra/db/prisma.service';

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
  ) {
    this.ZONE_ID = this.configService.get<string>('CLOUDSTACK_DEFAULT_ZONE_ID');
  }

  async execute(input: IAddVolumeInput): Promise<IAddVolumeOutput> {
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
      offer: {
        id: input.offerId,
      } as IVolumeOffer,
    });

    return {
      created: true,
      volumeId: volumeCreated.id,
    };
  }
}

export const AddVolumeProvider: Provider = {
  provide: IAddVolume,
  useClass: AddVolume,
};
