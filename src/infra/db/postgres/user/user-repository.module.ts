import { Module } from '@nestjs/common';
import { UserRepositoryProvider } from './user-repository.adapter';

@Module({
  providers: [UserRepositoryProvider],
  exports: [UserRepositoryProvider],
})
export class UserRepositoryModule {}
