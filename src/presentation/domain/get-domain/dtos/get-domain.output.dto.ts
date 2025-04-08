import { IDomain } from 'src/domain/entities/domain';

export class GetDomainOutputDto {
  id: string;
  name: string;
  vpcId: string;
  rootProjectId: string;

  constructor(domain: IDomain) {
    this.id = domain.id;
    this.name = domain.name;
    this.vpcId = domain.vpc.id;
    this.rootProjectId = domain.rootProject.id;
  }
}
