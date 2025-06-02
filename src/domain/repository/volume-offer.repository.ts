import { IRepositoryBase } from '../contracts/repository-base';
import { IVolumeOffer } from '../entities/volume-offer';

export abstract class IVolumeOfferRepository
  implements IRepositoryBase<IVolumeOffer>
{
  abstract createVolumeOffer(
    input: Partial<IVolumeOffer>,
  ): Promise<IVolumeOffer>;
  abstract mapToDomain(persistencyObject: any): IVolumeOffer;
}
