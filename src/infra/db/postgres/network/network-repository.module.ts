import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma.module';
import { NetworkRepositoryProvider } from './network-repository.adapter';

@Module({
  imports: [PrismaModule],
  providers: [NetworkRepositoryProvider],
  exports: [NetworkRepositoryProvider],
})
export class NetworkRepositoryModule {}
