import { Module } from '@nestjs/common';
import { ProjectDataModule } from 'src/data-layer/use-cases/project/project-data.module';
import { AuthModule } from 'src/infra/auth/auth.module';
import { GetProjectUsersController } from './get-project-users.controller';

@Module({
  imports: [ProjectDataModule, AuthModule],
  controllers: [GetProjectUsersController],
})
export class GetProjectUsersModule {}
