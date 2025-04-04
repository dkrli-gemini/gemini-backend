import { Module } from '@nestjs/common';
import { ProjectDataModule } from 'src/data-layer/use-cases/project/project-data.module';
import { AddVirtualMachineController } from './add-virtual-machine.controller';

@Module({
  imports: [ProjectDataModule],
  controllers: [AddVirtualMachineController],
  providers: [],
  exports: [],
})
export class AddVirtualMachineModule {}
