import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { IController } from 'src/domain/contracts/controller';
import { created, IHttpResponse } from 'src/domain/contracts/http';
import {
  IAddVirtualMachine,
  IAddVirtualMachineOutput,
} from 'src/domain/contracts/use-cases/project/add-virtual-machine';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { AddVirtualMachineInputDto } from './dtos/add-virtual-machine.input.dto';
import { AddVirtualMachineOutputDto } from './dtos/add-virtual-machine.output.dto';

@Controller('projects')
@ApiTags('projects')
export class AddVirtualMachineController
  implements IController<AddVirtualMachineInputDto, AddVirtualMachineOutputDto>
{
  constructor(private readonly useCase: IAddVirtualMachine) {}

  @Post('/add-virtual-machine/:projectId')
  @AuthorizedTo(RolesEnum.ADMIN, RolesEnum.BASIC)
  async handle(
    @Body() input: AddVirtualMachineInputDto,
    @Req()
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    @Param('projectId') projectId?: string,
  ): Promise<IHttpResponse<AddVirtualMachineOutputDto | Error>> {
    const machine = await this.useCase.execute({
      offerId: input.offerId,
      templateId: input.templateId,
      name: input.name,
      networkId: input.networkId,
      projectId: projectId,
    });

    const response = this.mapToOutput(machine);
    return created(response);
  }

  private mapToOutput(
    machine: IAddVirtualMachineOutput,
  ): AddVirtualMachineOutputDto {
    return new AddVirtualMachineOutputDto(machine);
  }
}
