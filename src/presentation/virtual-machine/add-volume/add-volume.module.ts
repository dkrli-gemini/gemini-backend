import { Module } from '@nestjs/common';
import { AddVolumeController } from './add-volume.controller';
import { AddVolumeDataModule } from 'src/data-layer/use-cases/virtual-machine/add-volume-data.module';
import { PrismaModule } from 'src/infra/db/prisma.module';

@Module({
  imports: [AddVolumeDataModule, PrismaModule],
  controllers: [AddVolumeController],
})
export class AddVolumeModule {}
