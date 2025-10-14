import { Controller, Get, Param } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { ListForwardRulesInputDto } from './dtos/list-forward-rules.input.dto';
import { ListForwardRulesOutputDto } from './dtos/list-forward-rules.output.dto';
import { Request } from 'express';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { PrismaService } from 'src/infra/db/prisma.service';

@Controller('vpcs')
export class ListForwardRulesController
  implements IController<ListForwardRulesInputDto, ListForwardRulesOutputDto>
{
  constructor(private readonly prisma: PrismaService) {}

  @AuthorizedTo(RolesEnum.ADMIN, RolesEnum.BASIC)
  @Get('list-forward-rules/:projectId')
  async handle(
    _input: ListForwardRulesInputDto,
    req: Request,
    @Param('projectId') projectId?: string,
  ): Promise<IHttpResponse<ListForwardRulesOutputDto | Error>> {
    const rules = await this.prisma.portForwardRuleModel.findMany({
      where: { projectId },
    });

    return ok(new ListForwardRulesOutputDto(rules));
  }
}
