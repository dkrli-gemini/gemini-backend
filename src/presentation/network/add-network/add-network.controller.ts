import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { IController } from 'src/domain/contracts/controller';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { IAddNetwork } from 'src/domain/contracts/use-cases/networks/add-network';
import { INetwork } from 'src/domain/entities/network';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { Roles, RolesEnum } from 'src/infra/auth/roles.guard';
import { AddNetworkInputDto } from './dtos/add-network.input.dto';
import { AddNetworkOutputDto } from './dtos/add-network.output.dto';

@Controller('network')
export class AddNetworkController
  implements IController<AddNetworkInputDto, AddNetworkOutputDto>
{
  constructor(private readonly useCase: IAddNetwork) {}

  @AuthorizedTo(RolesEnum.BASIC, RolesEnum.ADMIN)
  @Post('add-network/:domainId')
  async handle(
    @Body() input: AddNetworkInputDto,
    @Req()
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    @Param('domainId') domainId?: string,
  ): Promise<IHttpResponse<AddNetworkOutputDto | Error>> {
    const response = await this.useCase.execute({
      cloudstackAclId: input.cloudstackAclId,
      name: input.name,
      domainId: domainId,
      cloudstackOfferId: input.cloudstackOfferId,
      gateway: input.gateway,
      netmask: input.netmask,
    });

    const mapped = this.mapToOutput(response);
    return ok(mapped);
  }

  private mapToOutput(network: INetwork): AddNetworkOutputDto {
    return new AddNetworkOutputDto(network);
  }
}
