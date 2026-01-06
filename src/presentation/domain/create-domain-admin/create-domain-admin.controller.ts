/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { IController } from 'src/domain/contracts/controller';
import { created, IHttpResponse } from 'src/domain/contracts/http';
import { ICreateDomain } from 'src/domain/contracts/use-cases/domain/create-domain';
import {
  IDomain,
  OrganizationBillingType,
} from 'src/domain/entities/domain';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { CreateDomainAdminInputDto } from './dtos/create-domain-admin.input.dto';
import { CreateDomainAdminOutputDto } from './dtos/create-domain-admin.output.dto';

@Controller('domain')
@ApiTags('domain')
export class CreateDomainAdminController
  implements IController<CreateDomainAdminInputDto, CreateDomainAdminOutputDto>
{
  constructor(private readonly useCase: ICreateDomain) {}

  @AuthorizedTo(RolesEnum.ADMIN)
  @Post('/create-domain-admin')
  async handle(
    @Body() input: CreateDomainAdminInputDto,
    @Req()
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    _projectId?: string,
  ): Promise<IHttpResponse<CreateDomainAdminOutputDto | Error>> {
    const domain = await this.useCase.execute({
      name: input.name,
      ownerId: input.ownerId,
      accountEmail: input.accountEmail,
      accountPassword: input.accountPassword,
      rootId: input.rootId,
      billingType: input.billingType as OrganizationBillingType,
    });

    const response = this.mapToOutput(domain);
    return created(response);
  }

  private mapToOutput(domain: IDomain): CreateDomainAdminOutputDto {
    return new CreateDomainAdminOutputDto(domain);
  }
}
