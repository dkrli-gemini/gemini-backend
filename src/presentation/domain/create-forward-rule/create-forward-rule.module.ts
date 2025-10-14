import { Module } from '@nestjs/common';
import { CreateForwardRuleController } from './create-forward-rule.controller';
import { PublicIpDataModule } from 'src/data-layer/use-cases/public-ip/public-ip-data.module';

@Module({
  imports: [PublicIpDataModule],
  controllers: [CreateForwardRuleController],
  providers: [],
  exports: [],
})
export class CreateForwardRuleModule {}
