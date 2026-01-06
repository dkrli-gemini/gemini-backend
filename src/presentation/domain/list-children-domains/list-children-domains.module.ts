import { Module } from '@nestjs/common';
import { ListChildrenDomainsController } from './list-children-domains.controller';
import { PrismaModule } from 'src/infra/db/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ListChildrenDomainsController],
  providers: [],
  exports: [],
})
export class ListChildrenDomainsModule {}
