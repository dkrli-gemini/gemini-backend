import { Module } from '@nestjs/common';
import { InstanceRepositoryModule } from 'src/infra/db/postgres/instance/instance-repository.module';
import { ListInstancesController } from './list-instances.controller';

@Module({
  imports: [InstanceRepositoryModule],
  controllers: [ListInstancesController],
})
export class ListInstancesModule {}
