import { IVolume } from 'src/domain/entities/volume';
import { IVolumeRepository } from 'src/domain/repository/volume.repository';
import { PrismaService } from '../../prisma.service';
import { IVolumeOffer } from 'src/domain/entities/volume-offer';
import { Injectable, Provider } from '@nestjs/common';

@Injectable()
export class VolumeRepositoryAdapter implements IVolumeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createVolume(input: Partial<IVolume>): Promise<IVolume> {
    const volume = await this.prisma.volumeModel.create({
      data: {
        id: input.id,
        name: input.name,
        machine: {
          connect: {
            id: input.machineId,
          },
        },
        offer: {
          connect: {
            id: input.offer.id,
          },
        },
      },
    });

    return this.mapToDomain(volume);
  }

  async listVolumesByMachine(machineId: string): Promise<IVolume[]> {
    const volumes = await this.prisma.volumeModel.findMany({
      where: {
        machineId,
      },
      include: {
        offer: true,
      },
    });

    const response = volumes.map((v) => this.mapToDomain(v));
    return response;
  }
  mapToDomain(persistencyObject: any): IVolume {
    const volume: IVolume = {
      machineId: persistencyObject.machineId,
      name: persistencyObject.name,
      offer: {
        id: persistencyObject.offerId,
      } as IVolumeOffer,
      id: persistencyObject.id,
    };

    return volume;
  }
}

export const VolumeRepositoryProvider: Provider = {
  provide: IVolumeRepository,
  useClass: VolumeRepositoryAdapter,
};
