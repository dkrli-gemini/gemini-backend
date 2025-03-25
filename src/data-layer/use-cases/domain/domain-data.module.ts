import { Module } from '@nestjs/common';
import { CloudstackModule } from 'src/infra/cloudstack/cloudstack.module';
import { DomainRepositoryModule } from 'src/infra/db/postgres/domain/domain-repository.module';
import { CreateDomainProvider } from './create-domain';

@Module({
  imports: [DomainRepositoryModule, CloudstackModule],
  providers: [CreateDomainProvider],
  exports: [CreateDomainProvider],
})
export class DomainDataModule {}
