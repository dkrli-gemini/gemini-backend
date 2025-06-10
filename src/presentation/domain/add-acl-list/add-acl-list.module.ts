import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/db/prisma.module';
import { ProjectRepositoryModule } from 'src/infra/db/postgres/project/project-repository.module';
import { AddAclListController } from './add-acl-list.controller';
import { CloudstackModule } from 'src/infra/cloudstack/cloudstack.module';

@Module({
  imports: [PrismaModule, ProjectRepositoryModule, CloudstackModule],
  controllers: [AddAclListController],
  providers: [],
  exports: [],
})
export class AddAclListModule {}
