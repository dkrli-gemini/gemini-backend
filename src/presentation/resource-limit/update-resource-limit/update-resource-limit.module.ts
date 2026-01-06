import { Module } from '@nestjs/common';
import { UpdateResourceLimitController } from './update-resource-limit.controller';
import { ResourceLimitRepositoryModule } from 'src/infra/db/postgres/resource-limit/resource-limit-adapter.module';

@Module({
  imports: [ResourceLimitRepositoryModule],
  controllers: [UpdateResourceLimitController],
})
export class UpdateResourceLimitModule {}
