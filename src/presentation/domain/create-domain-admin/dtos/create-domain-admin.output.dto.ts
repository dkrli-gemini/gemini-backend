import { IDomain } from 'src/domain/entities/domain';

export class CreateDomainAdminOutputDto {
  id: string;
  rootProjectId: string;
  name: string;
  cloudstackDomainId: string;
  cloudstackAccountId: string;

  constructor(domain: IDomain) {
    this.id = domain.id;
    this.rootProjectId = domain.rootProject.id;
    this.cloudstackAccountId = domain.cloudstackAccountId;
    this.cloudstackDomainId = domain.cloudstackDomainId;
    this.name = domain.name;
  }
}
