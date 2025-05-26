import { Module } from '@nestjs/common';
import { AddInstanceController } from './add-instance.controller';
import { InstanceRepositoryModule } from 'src/infra/db/postgres/instance/instance-repository.module';

@Module({
  imports: [InstanceRepositoryModule],
  controllers: [AddInstanceController],
})
export class AddInstanceModule {}
