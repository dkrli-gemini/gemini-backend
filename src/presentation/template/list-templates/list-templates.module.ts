import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/db/prisma.module';
import { ListTemplatesController } from './list-templates.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ListTemplatesController],
})
export class ListTemplatesModule {}
