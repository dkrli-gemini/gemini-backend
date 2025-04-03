import { INetwork } from 'src/domain/entities/network';
import { IUseCase } from '../../use-case';

export interface IAddNetworkInput {
  domainId: string;
  name: string;
  cloudstackOfferId: string;
  cloudstackAclId: string;
  gateway: string;
  netmask: string;
}

export type IAddNetworkOutput = INetwork;

export abstract class IAddNetwork
  implements IUseCase<IAddNetworkInput, IAddNetworkOutput>
{
  abstract execute(input: IAddNetworkInput): Promise<INetwork>;
}
