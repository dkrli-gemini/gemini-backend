import { IDomain } from 'src/domain/entities/domain';

export class CreateRootDomainOutputDto {
  id: string;
  rootProjectId: string;
  name: string;
  cloudstackDomainId: string;
  cloudstackAccountId: string;

  constructor(domain: IDomain) {
    this.id = domain.id;
    this.rootProjectId = domain.rootProject.id;
    this.cloudstackAccountId = domain.cloudstackAccountId;
    this.name = domain.name;
  }
}
