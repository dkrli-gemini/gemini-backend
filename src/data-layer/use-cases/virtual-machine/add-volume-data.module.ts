import { Module } from '@nestjs/common';
import { CloudstackModule } from 'src/infra/cloudstack/cloudstack.module';
import { VirtualMachineRepositoryModule } from 'src/infra/db/postgres/virtual-machine/virtual-machine-repository.module';
import { VolumeOfferRepositoryModule } from 'src/infra/db/postgres/volume-offer/volue-offer-repository.module';
import { VolumeRepositoryModule } from 'src/infra/db/postgres/volume/volume-repository.module';
import { AddVolumeProvider } from './add-volume';
import { PrismaModule } from 'src/infra/db/prisma.module';
import { JobRepositoryModule } from 'src/infra/db/postgres/job/job-repository.module';

@Module({
  imports: [
    VirtualMachineRepositoryModule,
    VolumeRepositoryModule,
    VolumeOfferRepositoryModule,
    CloudstackModule,
    PrismaModule,
    JobRepositoryModule,
  ],
  providers: [AddVolumeProvider],
  exports: [AddVolumeProvider],
})
export class AddVolumeDataModule {}
