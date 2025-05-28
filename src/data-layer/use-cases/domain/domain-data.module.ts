import { Module } from '@nestjs/common';
import { CloudstackModule } from 'src/infra/cloudstack/cloudstack.module';
import { DomainRepositoryModule } from 'src/infra/db/postgres/domain/domain-repository.module';
import { CreateDomainProvider } from './create-domain';
import { CreateRootDomainProvider } from './create-root-domain';
import { ProjectRepositoryModule } from 'src/infra/db/postgres/project/project-repository.module';
import { ResourceLimitRepositoryModule } from 'src/infra/db/postgres/resource-limit/resource-limit-adapter.module';

@Module({
  imports: [
    DomainRepositoryModule,
    CloudstackModule,
    ProjectRepositoryModule,
    ResourceLimitRepositoryModule,
  ],
  providers: [CreateDomainProvider, CreateRootDomainProvider],
  exports: [CreateDomainProvider, CreateRootDomainProvider],
})
export class DomainDataModule {}
