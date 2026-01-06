import { IRepositoryBase } from '../contracts/repository-base';
import { IPortForwardRule, IPublicIp } from '../entities/public-ips';

export abstract class IPublicIPRepository
  implements IRepositoryBase<IPublicIp>
{
  abstract createPublicIp(
    id: string,
    address: string,
    vpcId: string,
    projectId: string,
  ): Promise<IPublicIp>;
  abstract addPortForwardingRule(
    publicIpId: string,
    input: IPortForwardRule,
  ): Promise<IPortForwardRule>;
  abstract mapToDomain(persistencyObject: any): IPublicIp;
}
