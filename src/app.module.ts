import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectDataModule } from './data-layer/use-cases/project/project-data.module';
import { AuthModule } from './infra/auth/auth.module';
import { ProjectRepositoryModule } from './infra/db/postgres/project/project-repository.module';
import { UserRepositoryModule } from './infra/db/postgres/user/user-repository.module';
import { AddProjectUserModule } from './presentation/project/add-project-user/add-project-user.module';
import { AddProjectUserOutputDto } from './presentation/project/add-project-user/dtos/add-project-user-output.dto';
import { AddProjectModule } from './presentation/project/add-project/add-project.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ProjectDataModule,
    AddProjectModule,
    AddProjectUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
