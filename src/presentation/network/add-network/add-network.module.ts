import { Module } from '@nestjs/common';
import { NetworkDataModule } from 'src/data-layer/use-cases/network/network-data.module';
import { AuthModule } from 'src/infra/auth/auth.module';
import { AddNetworkController } from './add-network.controller';

@Module({
  imports: [NetworkDataModule],
  controllers: [AddNetworkController],
  providers: [],
  exports: [],
})
export class AddNetworkModule {}
