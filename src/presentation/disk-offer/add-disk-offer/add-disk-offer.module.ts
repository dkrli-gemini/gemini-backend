import { Module } from '@nestjs/common';
import { AddDiskOfferController } from './add-disk-offer.controller';
import { VolumeOfferRepositoryModule } from 'src/infra/db/postgres/volume-offer/volue-offer-repository.module';

@Module({
  imports: [VolumeOfferRepositoryModule],
  controllers: [AddDiskOfferController],
  providers: [],
  exports: [],
})
export class AddDiskOfferModule {}
