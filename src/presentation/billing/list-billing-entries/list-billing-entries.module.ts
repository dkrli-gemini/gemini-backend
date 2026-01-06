import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/db/prisma.module';
import { ListBillingEntriesController } from './list-billing-entries.controller';
import { BillingModule } from 'src/data-layer/services/billing/billing.module';

@Module({
  imports: [PrismaModule, BillingModule],
  controllers: [ListBillingEntriesController],
})
export class ListBillingEntriesModule {}
