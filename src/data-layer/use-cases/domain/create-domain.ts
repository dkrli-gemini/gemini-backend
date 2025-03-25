import { Injectable, Provider } from '@nestjs/common';
import {
  ICreateDomain,
  ICreateDomainInput,
} from 'src/domain/contracts/use-cases/domain/create-domain';
import { IDomain } from 'src/domain/entities/domain';
import { IProject } from 'src/domain/entities/project';
import { IDomainRepository } from 'src/domain/repository/domain.repoitory';

@Injectable()
export class CreateDomain implements ICreateDomain {
  constructor(private readonly domainRepository: IDomainRepository) {}

  async execute(input: ICreateDomainInput): Promise<IDomain> {
    const domain = await this.domainRepository.createDomain(
      {
        name: input.name,
        rootProject: {} as IProject,
        cloudstackAccountId: input.cloudstackAccountId,
        cloudstackDomainId: input.cloudstackDomainId,
      },
      input.ownerId,
    );
    return domain;
  }
}

export const CreateDomainProvider: Provider = {
  provide: ICreateDomain,
  useClass: CreateDomain,
};
