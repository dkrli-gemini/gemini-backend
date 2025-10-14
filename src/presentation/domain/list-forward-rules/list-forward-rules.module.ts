import { Module } from '@nestjs/common';
import { ListForwardRulesController } from './list-forward-rules.controller';
import { PrismaModule } from 'src/infra/db/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ListForwardRulesController],
  providers: [],
  exports: [],
})
export class ListForwardRulesModule {}
