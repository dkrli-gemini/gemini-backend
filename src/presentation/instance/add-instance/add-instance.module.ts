import { Module } from '@nestjs/common';
import { AddInstanceController } from './add-instance.controller';

@Module({
    controllers: [AddInstanceController],
    providers: [],
    exports: [],
})
export class AddInstance {}
