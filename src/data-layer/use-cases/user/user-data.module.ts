import { Module } from '@nestjs/common';
import e from 'express';
import { UserRepositoryModule } from 'src/infra/db/postgres/user/user-repository.module';
import { GetUserProvider } from './get-user';

@Module({
  imports: [UserRepositoryModule],
  providers: [GetUserProvider],
  exports: [GetUserProvider],
})
export class UserDataModule {}
