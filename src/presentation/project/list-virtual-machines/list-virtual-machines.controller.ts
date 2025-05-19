import { Controller, Get, Param } from '@nestjs/common';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { IController } from 'src/domain/contracts/controller';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { IVirtualMachine } from 'src/domain/entities/virtual-machine';
import { IVirtualMachineRepository } from 'src/domain/repository/virtual-machine.repository';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { ListVirtualMachinesOutputDto } from './dtos/list-virtual-machines.output.dto';

@Controller('projects')
export class ListVirtualMachinesController
  implements IController<null, ListVirtualMachinesOutputDto>
{
  constructor(private readonly projectRepository: IVirtualMachineRepository) {}

  @Get('/list-machines/:projectId')
  @AuthorizedTo(RolesEnum.ADMIN, RolesEnum.BASIC)
  async handle(
    input: null,
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    @Param('projectId') projectId?: string,
  ): Promise<IHttpResponse<ListVirtualMachinesOutputDto | Error>> {
    const result = await this.projectRepository.listVirtualMachines(projectId);
    const response = this.mapToOutput(result);
    return ok(response);
  }

  private mapToOutput(
    machines: IVirtualMachine[],
  ): ListVirtualMachinesOutputDto {
    return new ListVirtualMachinesOutputDto(machines);
  }
}
