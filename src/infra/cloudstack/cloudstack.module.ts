import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudstackService } from './cloudstack';

@Module({
  imports: [ConfigModule],
  providers: [CloudstackService],
  exports: [CloudstackService],
})
export class CloudstackModule {}
