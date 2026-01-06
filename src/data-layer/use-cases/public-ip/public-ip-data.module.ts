import { Module } from '@nestjs/common';
import { CloudstackModule } from 'src/infra/cloudstack/cloudstack.module';
import { PublicIpRepositoryModule } from 'src/infra/db/postgres/public-ip/public-ip-repository.module';
import { PrismaModule } from 'src/infra/db/prisma.module';
import { AcquirePublicIpProvider } from './acquire-public-ip';
import { JobRepositoryModule } from 'src/infra/db/postgres/job/job-repository.module';
import { CreateForwardRuleProvider } from './create-forward-rule';
import { BillingModule } from 'src/data-layer/services/billing/billing.module';

@Module({
  imports: [
    PrismaModule,
    CloudstackModule,
    PublicIpRepositoryModule,
    JobRepositoryModule,
    BillingModule,
  ],
  providers: [AcquirePublicIpProvider, CreateForwardRuleProvider],
  exports: [AcquirePublicIpProvider, CreateForwardRuleProvider],
})
export class PublicIpDataModule {}
