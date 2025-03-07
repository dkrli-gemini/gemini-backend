import { Module } from '@nestjs/common';
import { ProjectDataModule } from 'src/data-layer/use-cases/project/project-data.module';
import { AuthModule } from 'src/infra/auth/auth.module';
import { AddProjectUserController } from './add-project-user.controller';

@Module({
  imports: [ProjectDataModule, AuthModule],
  controllers: [AddProjectUserController],
})
export class AddProjectUserModule {}
