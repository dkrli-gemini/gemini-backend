import { Injectable, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IAddNetwork,
  IAddNetworkInput,
} from 'src/domain/contracts/use-cases/networks/add-network';
import { IDomain } from 'src/domain/entities/domain';
import { INetwork } from 'src/domain/entities/network';
import { IDomainRepository } from 'src/domain/repository/domain.repoitory';
import { INetworkRepository } from 'src/domain/repository/network.repository';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';

@Injectable()
export class AddNetwork implements IAddNetwork {
  private defaultZoneId: string;

  constructor(
    private readonly networkRepository: INetworkRepository,
    private readonly cloudstackService: CloudstackService,
    private readonly domainRepository: IDomainRepository,
    private readonly configService: ConfigService,
  ) {
    this.defaultZoneId = this.configService.get<string>(
      'CLOUDSTACK_DEFAULT_ZONE_ID',
    );
  }

  async execute(input: IAddNetworkInput): Promise<INetwork> {
    const domain = await this.domainRepository.getDomain(input.domainId);

    const cloudstackNetwork = await this.cloudstackService.handle({
      command: CloudstackCommands.Network.CreateNetwork,
      additionalParams: {
        name: input.name,
        networkofferingid: input.cloudstackOfferId,
        zoneid: this.defaultZoneId,
        aclid: input.cloudstackAclId,
        gateway: input.gateway,
        netmask: input.netmask,
        domainid: domain.cloudstackDomainId,
        account: domain.name,
        vpcid: domain.vpc.cloudstackId,
      },
    });

    const networkCreated = await this.networkRepository.createNetwork({
      cloudstackAclId: input.cloudstackAclId,
      cloudstackOfferId: input.cloudstackOfferId,
      domain: {
        id: input.domainId,
      } as IDomain,
      cloudstackId: cloudstackNetwork.createnetworkresponse.network.id,
      gateway: input.gateway,
      netmask: input.netmask,
      name: input.name,
    });

    return networkCreated;
  }
}

export const AddNetworkProvider: Provider = {
  provide: IAddNetwork,
  useClass: AddNetwork,
};
