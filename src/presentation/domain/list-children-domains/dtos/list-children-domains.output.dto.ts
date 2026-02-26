import { DomainModel } from '@prisma/client';

export class DomainDto {
  id: string;
  name: string;
  isDistributor: boolean;

  constructor(domain: DomainModel) {
    this.id = domain.id;
    this.name = domain.name;
    this.isDistributor = domain.isDistributor;
  }
}

export class ListChildrenDomainsOutputDto {
  domains: DomainDto[];

  constructor(data: DomainModel[]) {
    this.domains = data.map((d) => new DomainDto(d));
  }
}
