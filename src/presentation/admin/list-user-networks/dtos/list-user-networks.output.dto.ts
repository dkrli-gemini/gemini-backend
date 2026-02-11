export class UserNetworkDto {
  id: string;
  name: string;
  gateway: string;
  netmask: string;
  aclName: string;
  isL2: boolean;

  constructor(input: {
    id: string;
    name: string;
    gateway: string;
    netmask: string;
    aclName: string;
    isL2: boolean;
  }) {
    this.id = input.id;
    this.name = input.name;
    this.gateway = input.gateway;
    this.netmask = input.netmask;
    this.aclName = input.aclName;
    this.isL2 = input.isL2;
  }
}

export class UserProjectNetworksDto {
  projectId: string;
  projectName: string;
  networks: UserNetworkDto[];

  constructor(input: {
    projectId: string;
    projectName: string;
    networks: UserNetworkDto[];
  }) {
    this.projectId = input.projectId;
    this.projectName = input.projectName;
    this.networks = input.networks;
  }
}

export class ListUserNetworksOutputDto {
  projects: UserProjectNetworksDto[];

  constructor(projects: UserProjectNetworksDto[]) {
    this.projects = projects;
  }
}
