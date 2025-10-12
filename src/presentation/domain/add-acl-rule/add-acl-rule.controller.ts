import { Body, Controller, Param, Post } from '@nestjs/common';
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
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';

@Controller('vpcs')
export class AddAclRuleController
  implements IController<AddAclRuleInputDto, AddAclRuleOutputDto>
{
  constructor(
    private readonly aclRulesRepository: IAclRulesRepository,
    private readonly cloudstack: CloudstackService,
  ) {}

  @AuthorizedTo(RolesEnum.BASIC, RolesEnum.ADMIN)
  @Post('add-acl-rule/:aclListId')
  async handle(
    @Body() input: AddAclRuleInputDto,
    req: Request,
    @Param('aclListId') aclListId?: string,
  ): Promise<IHttpResponse<AddAclRuleOutputDto | Error>> {
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
