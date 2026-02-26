import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { ProjectRoleModel } from '@prisma/client';
import { IController } from 'src/domain/contracts/controller';
import { AddAclRuleInputDto } from './dtos/add-acl-rule.input.dto';
import { AddAclRuleOutputDto } from './dtos/add-acl-rule.output.dto';
import { Request } from 'express';
import { created, IHttpResponse } from 'src/domain/contracts/http';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';
import { IAclRulesRepository } from 'src/domain/repository/acl-rules.repository';
import { PrismaService } from 'src/infra/db/prisma.service';
import { InvalidParamError } from 'src/domain/errors/invalid-param.error';
import { throwsException } from 'src/utilities/exception';

@Controller('vpcs')
export class AddAclRuleController
  implements IController<AddAclRuleInputDto, AddAclRuleOutputDto>
{
  constructor(
    private readonly aclRulesRepository: IAclRulesRepository,
    private readonly cloudstack: CloudstackService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('add-acl-rule/:aclListId')
  async handle(
    @Body() input: AddAclRuleInputDto,
    @Req() req: Request,
    @Param('aclListId') aclListId?: string,
  ): Promise<IHttpResponse<AddAclRuleOutputDto | Error>> {
    const acl = await this.prisma.aclListModel.findUnique({
      where: { id: aclListId },
      select: { id: true, vpcId: true },
    });

    if (!acl) {
      throwsException(new InvalidParamError('Lista ACL não encontrada.'));
    }

    const domain = await this.prisma.domainModel.findFirst({
      where: { vpcId: acl.vpcId },
      select: { id: true },
    });

    if (!domain?.id) {
      throwsException(
        new InvalidParamError('Domínio da lista ACL não encontrado.'),
      );
    }

    const requester = req.user as any;
    const membershipCount = await this.prisma.domainMemberModel.count({
      where: {
        userId: requester?.id,
        role: {
          in: [
            ProjectRoleModel.OWNER,
            ProjectRoleModel.ADMIN,
            ProjectRoleModel.MEMBER,
          ],
        },
        project: {
          domainId: domain.id,
        },
      },
    });

    if (membershipCount === 0) {
      throwsException(
        new InvalidParamError(
          'Usuário sem permissão para criar regra ACL neste domínio.',
        ),
      );
    }

    const cloudstackCidrInput = input.cidrList.join(',');

    const params = {
      protocol: input.protocol,
      aclid: aclListId,
      action: input.action,
      cidrlist: cloudstackCidrInput,
      reason: input.description,
      traffictype: input.trafficType,
    };

    // if (input.protocol != NetworkProtocolEnum.ALL) {
    //   params['startPort'] = input.startPort;
    //   params['endPort'] = input.endPort;
    // }

    const cloudstackRule = (
      await this.cloudstack.handle({
        command: CloudstackCommands.VPC.CreateNetworkAcl,
        additionalParams: params,
      })
    ).createnetworkaclresponse;

    const aclRuleCreated = await this.aclRulesRepository.createAclRule({
      id: cloudstackRule.id,
      aclId: aclListId,
      action: input.action,
      cidrList: input.cidrList,
      endPort: input.endPort,
      protocol: input.protocol,
      startPort: input.startPort,
      trafficType: input.trafficType,
    });

    const response = new AddAclRuleOutputDto(aclRuleCreated.id, aclListId);
    return created(response);
  }
}
