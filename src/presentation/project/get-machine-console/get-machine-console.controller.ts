import { Controller, Get, Param } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { GetMachineConsoleOutputDto } from './dtos/get-machine-console.output.dto';
import { Request } from 'express';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { PrismaService } from 'src/infra/db/prisma.service';

@Controller('machines')
export class GetMachineConsoleController
  implements IController<null, GetMachineConsoleOutputDto>
{
  constructor(
    private readonly cloudstackService: CloudstackService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('/console/:machineId')
  @AuthorizedTo(RolesEnum.ADMIN, RolesEnum.BASIC)
  async handle(
    input: null,
    req: Request,
    @Param('machineId') machineId?: string,
  ): Promise<IHttpResponse<GetMachineConsoleOutputDto | Error>> {
    const machine = await this.prisma.virtualMachineModel.findUnique({
      where: {
        id: machineId,
      },
    });
    const response = await this.cloudstackService.handle({
      command: CloudstackCommands.VirtualMachine.GetConsole,
      additionalParams: {
        virtualmachineid: machine.cloudstackId,
      },
    });

    console.log(response);
    const result = response.createconsoleendpointresponse.consoleendpoint.url;
    return ok(new GetMachineConsoleOutputDto(result));
  }
}
