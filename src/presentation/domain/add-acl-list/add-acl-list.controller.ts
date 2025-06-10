/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Param, Post } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { AddAclListInputDto } from './dtos/add-acl-list.input.dto';
import { AddAclListOutputDto } from './dtos/add-acl-list.output.dto';
import { Request } from 'express';
import { created, IHttpResponse } from 'src/domain/contracts/http';
import { PrismaModule } from 'src/infra/db/prisma.module';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { PrismaService } from 'src/infra/db/prisma.service';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';

@Controller('vpcs')
export class AddAclListController
  implements IController<AddAclListInputDto, AddAclListOutputDto>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudstack: CloudstackService,
  ) {}

  @Post('/add-acl-list/:vpcId')
  @AuthorizedTo(RolesEnum.ADMIN, RolesEnum.BASIC)
  async handle(
    @Body() input: AddAclListInputDto,
    _req: Request,
    @Param('vpcId') vpcId?: string,
  ): Promise<IHttpResponse<AddAclListOutputDto | Error>> {
    const cloudstackAclList = (
      await this.cloudstack.handle({
        command: CloudstackCommands.VPC.CreateNetworkAclList,
        additionalParams: {
          name: input.name,
          description: input.description,
          vpcid: vpcId,
        },
      })
    ).createnetworkacllistresponse;

    const aclListCreated = await this.prisma.aclListModel.create({
      data: {
        id: cloudstackAclList.id,
        name: input.name,
        description: input.description,
        vpcId,
      },
    });

    const response = new AddAclListOutputDto(aclListCreated.id);
    return created(response);
  }
}
