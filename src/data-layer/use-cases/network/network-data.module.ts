import { Module } from '@nestjs/common';
import { CloudstackModule } from 'src/infra/cloudstack/cloudstack.module';
import { DomainRepositoryModule } from 'src/infra/db/postgres/domain/domain-repository.module';
import { NetworkRepositoryModule } from 'src/infra/db/postgres/network/network-repository.module';
import { AddNetworkProvider } from './add-network';
import { PrismaModule } from 'src/infra/db/prisma.module';
import { BillingModule } from 'src/data-layer/services/billing/billing.module';

@Module({
  imports: [
    NetworkRepositoryModule,
    CloudstackModule,
    DomainRepositoryModule,
    PrismaModule,
    BillingModule,
  ],
  providers: [AddNetworkProvider],
  exports: [AddNetworkProvider],
})
export class NetworkDataModule {}
