import { Module } from '@nestjs/common';
import { CreateRootDomainController } from './create-root-domain.controller';
import { DomainDataModule } from 'src/data-layer/use-cases/domain/domain-data.module';

@Module({
  imports: [DomainDataModule],
  controllers: [CreateRootDomainController],
  providers: [],
  exports: [],
})
export class CreateRootDomainModule {}
