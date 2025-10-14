import { Controller, Get, Param } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { ListPublicIpsOutputDto } from './dtos/list-public-ips.output.dto';
import { Request } from 'express';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { PrismaService } from 'src/infra/db/prisma.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';

@ApiTags('Public IP')
@Controller('vpcs')
export class ListPublicIpsController
  implements IController<null, ListPublicIpsOutputDto>
{
  constructor(private readonly prisma: PrismaService) {}

  @AuthorizedTo(RolesEnum.ADMIN, RolesEnum.BASIC)
  @Get('/list-public-ips/:projectId')
  async handle(
    input: null,
    req: Request,
    @Param('projectId') projectId?: string,
  ): Promise<IHttpResponse<ListPublicIpsOutputDto | Error>> {
    const project = await this.prisma.projectModel.findUnique({
      where: { id: projectId },
    });
    const domain = await this.prisma.domainModel.findUnique({
      where: { id: project.domainId },
    });
    const vpcId = domain.vpcId;

    const ips = await this.prisma.publicIPModel.findMany({
      where: {
        vpcId,
      },
    });

    return ok(new ListPublicIpsOutputDto(ips));
  }
}
