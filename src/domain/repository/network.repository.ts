import { IRepositoryBase } from '../contracts/repository-base';
import { INetwork } from '../entities/network';

export type ICreateNetworkInput = Partial<INetwork>;

export abstract class INetworkRepository implements IRepositoryBase<INetwork> {
  abstract createNetwork(input: ICreateNetworkInput): Promise<INetwork>;
  abstract mapToDomain(persistencyObject: any): INetwork;
}
