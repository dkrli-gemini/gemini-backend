import { Module } from '@nestjs/common';
import { CloudstackModule } from 'src/infra/cloudstack/cloudstack.module';
import { DomainRepositoryModule } from 'src/infra/db/postgres/domain/domain-repository.module';
import { NetworkRepositoryModule } from 'src/infra/db/postgres/network/network-repository.module';
import { AddNetworkProvider } from './add-network';

@Module({
  imports: [NetworkRepositoryModule, CloudstackModule, DomainRepositoryModule],
  providers: [AddNetworkProvider],
  exports: [AddNetworkProvider],
})
export class NetworkDataModule {}
