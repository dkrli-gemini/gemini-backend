import { IDomain } from 'src/domain/entities/domain';

export class GetDomainOutputDto {
  id: string;
  name: string;
  vpcId: string;

  constructor(domain: IDomain) {
    this.id = domain.id;
    this.name = domain.name;
    this.vpcId = domain.vpc.id;
  }
}
