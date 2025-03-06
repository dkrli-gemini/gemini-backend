import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma.module';
import { ProjectUserRepositoryProvider } from './project-user-repository.adapter';

@Module({
  imports: [PrismaModule],
  providers: [ProjectUserRepositoryProvider],
  exports: [ProjectUserRepositoryProvider],
})
export class ProjectUserRepositoryModule {}
