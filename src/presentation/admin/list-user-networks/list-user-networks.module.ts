import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/db/prisma.module';
import { ListUserNetworksController } from './list-user-networks.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ListUserNetworksController],
})
export class ListUserNetworksModule {}
