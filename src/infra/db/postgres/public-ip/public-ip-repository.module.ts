import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma.module';
import { PublicIpRepositoryProvider } from './public-ip-repository.adapter';

@Module({
  imports: [PrismaModule],
  providers: [PublicIpRepositoryProvider],
  exports: [PublicIpRepositoryProvider],
})
export class PublicIpRepositoryModule {}
