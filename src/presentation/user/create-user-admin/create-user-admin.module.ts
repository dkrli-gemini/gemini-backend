import { Module } from '@nestjs/common';
import { UserDataModule } from 'src/data-layer/use-cases/user/user-data.module';
import { CreateUserAdminController } from './create-user-admin.controller';

@Module({
  controllers: [CreateUserAdminController],
  imports: [UserDataModule],
})
export class CreateUserAdmin {}
