import { NetworkModel } from '@prisma/client';

export class NetworkDto {
  id: string;
  name: string;
  cloudstackId: string;
  gateway: string;
  netmask: string;

  constructor(network: NetworkModel) {
    this.id = network.id;
    this.name = network.name;
    this.cloudstackId = network.cloudstackId;
    this.gateway = network.gateway;
    this.netmask = network.netmask;
  }
}

export class ListNetworksOutputDto {
  networks: NetworkDto[];

  constructor(input: NetworkModel[]) {
    this.networks = input.map((n) => new NetworkDto(n));
  }
}
