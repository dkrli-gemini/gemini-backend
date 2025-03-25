import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma.module';
import { DomainRepositoryProvider } from './domain-repository.adapter';

@Module({
  imports: [PrismaModule],
  providers: [DomainRepositoryProvider],
  exports: [DomainRepositoryProvider],
})
export class DomainRepositoryModule {}
