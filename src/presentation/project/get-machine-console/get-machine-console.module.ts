import { Module } from '@nestjs/common';
import { GetMachineConsoleController } from './get-machine-console.controller';
import { CloudstackModule } from 'src/infra/cloudstack/cloudstack.module';

@Module({
  imports: [CloudstackModule],
  controllers: [GetMachineConsoleController],
  providers: [],
  exports: [],
})
export class GetMachineConsoleModule {}
