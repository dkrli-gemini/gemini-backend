import { Module } from '@nestjs/common';
import { ListNetworksController } from './list-networks.controller';
import { PrismaModule } from 'src/infra/db/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ListNetworksController],
  providers: [],
  exports: [],
})
export class ListNetworksModule {}
