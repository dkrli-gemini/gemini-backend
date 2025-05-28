import { Module } from '@nestjs/common';
import { AddResourceLimitController } from './add-resource-limit.controller';
import { ResourceLimitRepositoryModule } from 'src/infra/db/postgres/resource-limit/resource-limit-adapter.module';

@Module({
  imports: [ResourceLimitRepositoryModule],
  controllers: [AddResourceLimitController],
})
export class AddResourceLimitModule {}
