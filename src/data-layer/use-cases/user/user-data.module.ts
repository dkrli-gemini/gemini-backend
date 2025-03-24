import { Module } from '@nestjs/common';
import e from 'express';
import { UserRepositoryModule } from 'src/infra/db/postgres/user/user-repository.module';
import { CreateUser, CreateUserProvider } from './create-user';
import { GetUserProvider } from './get-user';

@Module({
  imports: [UserRepositoryModule],
  providers: [GetUserProvider, CreateUserProvider],
  exports: [GetUserProvider, CreateUserProvider],
})
export class UserDataModule {}
