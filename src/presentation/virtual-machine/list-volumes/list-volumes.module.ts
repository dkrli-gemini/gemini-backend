import { Module } from '@nestjs/common';
import { ListVolumesController } from './list-volumes.controller';
import { VolumeRepositoryModule } from 'src/infra/db/postgres/volume/volume-repository.module';

@Module({
  imports: [VolumeRepositoryModule],
  controllers: [ListVolumesController],
  providers: [],
  exports: [],
})
export class ListVolumesModule {}
