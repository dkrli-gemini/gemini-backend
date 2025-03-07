import { Module } from '@nestjs/common';
import { ProjectDataModule } from 'src/data-layer/use-cases/project/project-data.module';
import { AuthModule } from 'src/infra/auth/auth.module';
import { AddProjectController } from './add-project.controller';

@Module({
  imports: [ProjectDataModule, AuthModule],
  controllers: [AddProjectController],
})
export class AddProjectModule {}
