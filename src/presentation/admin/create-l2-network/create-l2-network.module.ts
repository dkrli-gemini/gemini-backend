import { Module } from '@nestjs/common';
import { CloudstackModule } from 'src/infra/cloudstack/cloudstack.module';
import { PrismaModule } from 'src/infra/db/prisma.module';
import { CreateL2NetworkController } from './create-l2-network.controller';

@Module({
  imports: [PrismaModule, CloudstackModule],
  controllers: [CreateL2NetworkController],
})
export class CreateL2NetworkModule {}
