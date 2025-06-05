import { Module } from '@nestjs/common';
import { VolumeRepositoryProvider } from './volume-repository.adapter';
import { PrismaModule } from '../../prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [VolumeRepositoryProvider],
  exports: [VolumeRepositoryProvider],
})
export class VolumeRepositoryModule {}
