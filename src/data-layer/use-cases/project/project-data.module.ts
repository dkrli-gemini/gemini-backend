import { Module } from '@nestjs/common';
import { ProjectUserRepositoryModule } from 'src/infra/db/postgres/project-user/project-user-repository.module';
import { ProjectRepositoryModule } from 'src/infra/db/postgres/project/project-repository.module';
import { UserRepositoryModule } from 'src/infra/db/postgres/user/user-repository.module';
import { AddProjectProvider } from './add-project';
import { AddProjectUserProvider } from './add-project-user';

@Module({
  imports: [
    ProjectRepositoryModule,
    UserRepositoryModule,
    ProjectUserRepositoryModule,
  ],
  providers: [AddProjectProvider, AddProjectUserProvider],
  exports: [AddProjectProvider, AddProjectUserProvider],
})
export class ProjectDataModule {}
