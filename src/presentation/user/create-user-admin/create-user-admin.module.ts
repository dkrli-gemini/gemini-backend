import { Module } from '@nestjs/common';
import { CreateUserAdminController } from './create-user-admin.controller';

@Module({
    controllers: [CreateUserAdminController],
    providers: [],
    exports: [],
})
export class CreateUserAdmin {}
