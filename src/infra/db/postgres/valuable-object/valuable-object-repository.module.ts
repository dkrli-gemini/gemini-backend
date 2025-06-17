import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma.module';
import { ValuableObjectRepositoryProvider } from './valuable-object-repository.adapter';

@Module({
  imports: [PrismaModule],
  providers: [ValuableObjectRepositoryProvider],
  exports: [ValuableObjectRepositoryProvider],
})
export class ValuableObjectRepositoryModule {}
