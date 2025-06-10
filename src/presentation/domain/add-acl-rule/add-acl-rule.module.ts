import { Module } from '@nestjs/common';
import { AddAclRuleController } from './add-acl-rule.controller';
import { CloudstackModule } from 'src/infra/cloudstack/cloudstack.module';
import { AclRulesRepositoryModule } from 'src/infra/db/postgres/acl-rules/acl-rules-repository.module';

@Module({
  imports: [CloudstackModule, AclRulesRepositoryModule],
  controllers: [AddAclRuleController],
  providers: [],
  exports: [],
})
export class AddAclRuleModule {}
