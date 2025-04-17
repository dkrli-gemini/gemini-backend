import { Module } from '@nestjs/common';
import { GetUserProjectsController } from './get-user-projects.controller';

@Module({
  controllers: [GetUserProjectsController],
  providers: [],
  exports: [],
})
export class GetUserProjectsModule {}
