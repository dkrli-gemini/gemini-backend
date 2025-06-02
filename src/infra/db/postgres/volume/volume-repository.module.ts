import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { VolumeRepositoryProvider } from './volume-repository.adapter';

@Module({
  imports: [PrismaService],
  providers: [VolumeRepositoryProvider],
  exports: [VolumeRepositoryProvider],
})
export class VolumeRepositoryModule {}
