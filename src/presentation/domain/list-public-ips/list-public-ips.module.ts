import { Module } from '@nestjs/common';
import { ListPublicIpsController } from './list-public-ips.controller';
import { PrismaModule } from 'src/infra/db/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ListPublicIpsController],
  providers: [],
  exports: [],
})
export class ListPublicIpsModule {}
