import { Module } from '@nestjs/common';
import { DomainRepositoryModule } from 'src/infra/db/postgres/domain/domain-repository.module';
import { GetDomainController } from './get-domain.controller';

@Module({
  imports: [DomainRepositoryModule],
  controllers: [GetDomainController],
  providers: [],
  exports: [],
})
export class GetDomainModule {}
