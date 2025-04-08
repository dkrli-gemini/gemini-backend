import { Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { IController } from 'src/domain/contracts/controller';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { IDomain } from 'src/domain/entities/domain';
import { IDomainRepository } from 'src/domain/repository/domain.repoitory';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { GetDomainOutputDto } from './dtos/get-domain.output.dto';

@Controller('domain')
export class GetDomainController
  implements IController<null, GetDomainOutputDto>
{
  constructor(private readonly domainRepository: IDomainRepository) {}

  @AuthorizedTo(RolesEnum.ADMIN, RolesEnum.BASIC)
  @Get('/:domainId')
  async handle(
    input: null,
    @Req()
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    @Param('domainId') domainId?: string,
  ): Promise<IHttpResponse<GetDomainOutputDto | Error>> {
    const domain = await this.domainRepository.getDomain(domainId);
    console.log(domain);

    const reponse = this.mapToOutput(domain);
    return ok(reponse);
  }

  private mapToOutput(domain: IDomain) {
    return new GetDomainOutputDto(domain);
  }
}
