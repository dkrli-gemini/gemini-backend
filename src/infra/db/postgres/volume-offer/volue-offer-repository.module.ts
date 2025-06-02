import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma.module';
import { VolumeOfferRepositoryProvider } from './volue-offer-repository.adapter';

@Module({
  imports: [PrismaModule],
  providers: [VolumeOfferRepositoryProvider],
  exports: [VolumeOfferRepositoryProvider],
})
export class VolumeOfferRepositoryModule {}
