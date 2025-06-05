import { IVolumeOffer } from 'src/domain/entities/volume-offer';
import { IVolumeOfferRepository } from 'src/domain/repository/volume-offer.repository';
import { PrismaService } from '../../prisma.service';
import { Injectable, Provider } from '@nestjs/common';

@Injectable()
export class VolumeOfferRepositoryAdapter implements IVolumeOfferRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createVolumeOffer(input: Partial<IVolumeOffer>): Promise<IVolumeOffer> {
    const offer = await this.prisma.diskOfferModel.create({
      data: {
        capacity: input.capacity,
        id: input.cloudstackId,
        name: input.name,
      },
    });

    return this.mapToDomain(offer);
  }

  async getOffer(id: string): Promise<IVolumeOffer> {
    const offer = await this.prisma.diskOfferModel.findUnique({
      where: {
        id,
      },
    });

    return this.mapToDomain(offer);
  }

  mapToDomain(persistencyObject: any): IVolumeOffer {
    const response: IVolumeOffer = {
      name: persistencyObject.name,
      id: persistencyObject.id,
      cloudstackId: persistencyObject.cloudstackId,
      capacity: persistencyObject.capacity,
    };
    return response;
  }
}

export const VolumeOfferRepositoryProvider: Provider = {
  provide: IVolumeOfferRepository,
  useClass: VolumeOfferRepositoryAdapter,
};
