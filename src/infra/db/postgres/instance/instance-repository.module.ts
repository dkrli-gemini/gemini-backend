import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma.module';
import { InstanceRepositoryProvider } from './instance-repository.adapter';

@Module({
  imports: [PrismaModule],
  providers: [InstanceRepositoryProvider],
  exports: [InstanceRepositoryProvider],
})
export class InstanceRepositoryModule {}
