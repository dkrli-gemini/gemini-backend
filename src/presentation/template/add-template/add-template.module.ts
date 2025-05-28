import { Module } from '@nestjs/common';
import { AddTemplateController } from './add-template.controller';
import { PrismaModule } from 'src/infra/db/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AddTemplateController],
})
export class AddTemplateModule {}
