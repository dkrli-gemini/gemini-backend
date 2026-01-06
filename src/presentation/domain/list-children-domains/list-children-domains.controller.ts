import { Controller, Get, Param, Req } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { ListChildrenDomainsOutputDto } from './dtos/list-children-domains.output.dto';
import { Request } from 'express';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { PrismaService } from 'src/infra/db/prisma.service';

@Controller('domain')
export class ListChildrenDomainsController
  implements IController<null, ListChildrenDomainsOutputDto>
{
  constructor(private readonly prismaService: PrismaService) {}

  @Get('/list-children/:domainId')
  @AuthorizedTo(RolesEnum.BASIC, RolesEnum.ADMIN)
  async handle(
    _input: null,
    @Req() req: Request,
    @Param('domainId') domainId?: string,
  ): Promise<IHttpResponse<ListChildrenDomainsOutputDto | Error>> {
    const domains = await this.prismaService.domainModel.findMany({
      where: {
        rootId: domainId,
      },
    });

    return ok(new ListChildrenDomainsOutputDto(domains));
  }
}
