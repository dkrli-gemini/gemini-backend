import { Module } from '@nestjs/common';
import { DomainDataModule } from 'src/data-layer/use-cases/domain/domain-data.module';
import { CreateDomainAdminController } from './create-domain-admin.controller';

@Module({
  controllers: [CreateDomainAdminController],
  imports: [DomainDataModule],
})
export class CreateDomainAdmin {}
