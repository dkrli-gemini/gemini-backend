import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma.module';
import { AclRulesRepositoryProvider } from './acl-rules-repository.adapter';

@Module({
  imports: [PrismaModule],
  providers: [AclRulesRepositoryProvider],
  exports: [AclRulesRepositoryProvider],
})
export class AclRulesRepositoryModule {}
