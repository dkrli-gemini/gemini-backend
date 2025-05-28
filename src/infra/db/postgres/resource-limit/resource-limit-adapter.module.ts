import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma.module';
import { ResourceLimitRepositoryProvider } from './resource-limit.adapter';

@Module({
  imports: [PrismaModule],
  providers: [ResourceLimitRepositoryProvider],
  exports: [ResourceLimitRepositoryProvider],
})
export class ResourceLimitRepositoryModule {}
