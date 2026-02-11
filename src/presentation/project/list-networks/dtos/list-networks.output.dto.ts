import { NetworkModel } from '@prisma/client';

export class NetworkDto {
  id: string;
  name: string;
  cloudstackId: string;
  gateway: string;
  netmask: string;
  aclName: string;
  isL2: boolean;

  constructor(network: NetworkModel) {
    this.id = network.id;
    this.name = network.name;
    this.cloudstackId = network.id;
    this.gateway = network.gateway;
    this.netmask = network.netmask;
    this.aclName = network.aclName;
    this.isL2 = network.isL2;
  }
}

export class ListNetworksOutputDto {
  networks: NetworkDto[];

  constructor(input: NetworkModel[]) {
    this.networks = input.map((n) => new NetworkDto(n));
  }
}
