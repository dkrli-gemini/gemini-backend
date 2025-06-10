import { Body, Controller, Get, Param } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { AcquirePublicIpOutputDto } from './dtos/acquire-public-ip.output.dto';
import { Request } from 'express';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { IAcquirePublicIp } from 'src/domain/contracts/use-cases/public-ip/acquire-public-ip';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';

@Controller('vpcs')
export class AcquirePublicIpController
  implements IController<null, AcquirePublicIpOutputDto>
{
  constructor(private readonly useCase: IAcquirePublicIp) {}

  @AuthorizedTo(RolesEnum.ADMIN, RolesEnum.BASIC)
  @Get('acquire-public-ip/:vpcId')
  async handle(
    @Body() input: null,
    req: Request,
    @Param('vpcId') vpcId?: string,
  ): Promise<IHttpResponse<AcquirePublicIpOutputDto | Error>> {
    const publicIp = await this.useCase.execute({
      vpcId,
    });

    return ok(new AcquirePublicIpOutputDto(publicIp.id));
  }
}
