import { Module } from '@nestjs/common';
import { ListResourceLimitsController } from './list-resource-limits.controller';
import { ResourceLimitRepositoryModule } from 'src/infra/db/postgres/resource-limit/resource-limit-adapter.module';
import { PrismaModule } from 'src/infra/db/prisma.module';
import { BillingModule } from 'src/data-layer/services/billing/billing.module';

@Module({
  imports: [ResourceLimitRepositoryModule, PrismaModule, BillingModule],
  controllers: [ListResourceLimitsController],
  providers: [],
  exports: [],
})
export class ListResourceLimitsModule {}
