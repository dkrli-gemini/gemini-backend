import { Controller, Get, Param, Req } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { ListAclOutputDto } from './dtos/list-acl.output.dto';
import { Request } from 'express';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { PrismaService } from 'src/infra/db/prisma.service';

@Controller('vpcs')
export class ListAclController implements IController<null, ListAclOutputDto> {
  constructor(private readonly prisma: PrismaService) {}

  @AuthorizedTo(RolesEnum.ADMIN, RolesEnum.BASIC)
  @Get('list-acl/:projectId')
  async handle(
    input: null,
    @Req() req: Request,
    @Param('projectId') projectId?: string,
  ): Promise<IHttpResponse<ListAclOutputDto | Error>> {
    const domainId = (
      await this.prisma.projectModel.findUnique({
        where: { id: projectId },
      })
    ).domainId;
    const vpcId = (
      await this.prisma.domainModel.findUnique({
        where: { id: domainId },
      })
    ).vpcId;

    const lists = await this.prisma.aclListModel.findMany({
      where: {
        vpcId,
      },
      include: {
        AclRule: true,
      },
    });

    console.log(lists);
    return ok(new ListAclOutputDto(lists));
  }
}
