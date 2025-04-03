import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma.module';
import { VirtualMachineRepositoryProvider } from './virtual-machine-repository.adapter';

@Module({
  imports: [PrismaModule],
  providers: [VirtualMachineRepositoryProvider],
  exports: [VirtualMachineRepositoryProvider],
})
export class VirtualMachineRepositoryModule {}
