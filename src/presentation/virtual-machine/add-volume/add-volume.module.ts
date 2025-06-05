import { Module } from '@nestjs/common';
import { AddVolumeController } from './add-volume.controller';
import { AddVolumeDataModule } from 'src/data-layer/use-cases/virtual-machine/add-volume-data.module';

@Module({
  imports: [AddVolumeDataModule],
  controllers: [AddVolumeController],
})
export class AddVolumeModule {}
