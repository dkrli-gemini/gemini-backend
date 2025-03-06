import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma.module';
import { ProjectRepositoryProvider } from './project-repository.adapter';

@Module({
  imports: [PrismaModule],
  providers: [ProjectRepositoryProvider],
  exports: [ProjectRepositoryProvider],
})
export class ProjectRepositoryModule {}
