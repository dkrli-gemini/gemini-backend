import { Module } from '@nestjs/common';
import { DomainRepositoryModule } from 'src/infra/db/postgres/domain/domain-repository.module';
import { CreateDomainProvider } from './create-domain';

@Module({
  imports: [DomainRepositoryModule],
  providers: [CreateDomainProvider],
  exports: [CreateDomainProvider],
})
export class DomainDataModule {}
