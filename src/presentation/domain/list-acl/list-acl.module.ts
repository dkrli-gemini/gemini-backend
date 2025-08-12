import { Module } from '@nestjs/common';
import { ListAclController } from './list-acl.controller';
import { PrismaModule } from 'src/infra/db/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ListAclController],
  providers: [],
  exports: [],
})
export class ListAclModule {}
