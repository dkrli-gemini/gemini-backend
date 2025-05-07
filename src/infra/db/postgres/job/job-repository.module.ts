import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma.module';
import { JobRepositoryProvider } from './job-repository.adapter';

@Module({
  imports: [PrismaModule],
  providers: [JobRepositoryProvider],
  exports: [JobRepositoryProvider],
})
export class JobRepositoryModule {}
