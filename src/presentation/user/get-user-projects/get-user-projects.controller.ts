/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param, Req } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { GetUserProjectsOutputDto } from './dtos/get-user-projects.output.dto';
import { Request } from 'express';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { PrismaService } from 'src/infra/db/prisma.service';
import { IProject } from 'src/domain/entities/project';
import { DomainMemberModel } from '@prisma/client';

@Controller('users')
export class GetUserProjectsController
  implements IController<null, GetUserProjectsOutputDto>
{
  constructor(private readonly prisma: PrismaService) {}

  @AuthorizedTo(RolesEnum.BASIC, RolesEnum.ADMIN)
  @Get('/projects/')
  async handle(
    input: null,
    @Req() req: Request,
    userId?: string,
  ): Promise<IHttpResponse<GetUserProjectsOutputDto | Error>> {
    const response = await this.prisma.domainMemberModel.findMany({
      where: {
        userId: (req.user as any).id,
      },
    });
    const output = this.mapToOutput(response);
    return ok(output);
  }

  private mapToOutput(projects: DomainMemberModel[]): GetUserProjectsOutputDto {
    return new GetUserProjectsOutputDto(projects);
  }
}
