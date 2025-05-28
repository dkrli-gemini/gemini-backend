/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { AddTemplateInputDto } from './dtos/add-template.input.dto';
import { AddTemplateOutputDto } from './dtos/add-template.output.dto';
import { Request } from 'express';
import { created, IHttpResponse } from 'src/domain/contracts/http';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { PrismaService } from 'src/infra/db/prisma.service';

@Controller('templates')
export class AddTemplateController
  implements IController<AddTemplateInputDto, AddTemplateOutputDto>
{
  constructor(private readonly prisma: PrismaService) {}

  @Post('add-template')
  @AuthorizedTo(RolesEnum.ADMIN)
  async handle(
    @Body() input: AddTemplateInputDto,
    _req: Request,
    _projectId?: string,
  ): Promise<IHttpResponse<AddTemplateOutputDto | Error>> {
    const templateCreated = await this.prisma.templateOfferModel.create({
      data: {
        cloudstackId: input.cloudstackId,
        name: input.name,
        url: input.url,
      },
    });

    const response = new AddTemplateOutputDto(templateCreated.id);
    return created(response);
  }
}
