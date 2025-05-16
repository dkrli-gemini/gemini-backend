import { IDomain } from 'src/domain/entities/domain';

export class CreateRootDomainOutputDto {
  id: string;
  name: string;
  cloudstackDomainId: string;
  cloudstackAccountId: string;

  constructor(domain: IDomain) {
    this.id = domain.id;
    this.cloudstackAccountId = domain.cloudstackAccountId;
    this.name = domain.name;
  }
}
