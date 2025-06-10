import { Module } from '@nestjs/common';
import { AcquirePublicIpController } from './acquire-public-ip.controller';
import { PublicIpDataModule } from 'src/data-layer/use-cases/public-ip/public-ip-data.module';

@Module({
  imports: [PublicIpDataModule],
  controllers: [AcquirePublicIpController],
  providers: [],
  exports: [],
})
export class AcquirePublicIpModule {}
