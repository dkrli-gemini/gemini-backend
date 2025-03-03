import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma.module';
import { UserRepositoryProvider } from './user-repository.adapter';

@Module({
  imports: [PrismaModule],
  providers: [UserRepositoryProvider],
  exports: [UserRepositoryProvider],
})
export class UserRepositoryModule {}
