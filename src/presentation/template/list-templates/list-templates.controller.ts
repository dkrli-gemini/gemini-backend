import { Controller, Get } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { ListTemplatesOutputDto } from './dtos/list-templates.output.dto';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { PrismaService } from 'src/infra/db/prisma.service';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';

@Controller('templates')
export class ListTemplatesController
  implements IController<void, ListTemplatesOutputDto>
{
  constructor(private readonly prisma: PrismaService) {}

  @Get('list-templates')
  @AuthorizedTo(RolesEnum.ADMIN, RolesEnum.BASIC)
  async handle(): Promise<IHttpResponse<ListTemplatesOutputDto | Error>> {
    const templates = await this.prisma.templateOfferModel.findMany();
    return ok(new ListTemplatesOutputDto(templates));
  }
}
