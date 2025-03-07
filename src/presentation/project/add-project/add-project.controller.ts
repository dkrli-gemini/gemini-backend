import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { created, IHttpResponse } from 'src/domain/contracts/http';
import { AddProjectInputDto } from './dtos/add-project-input.dto';
import { AddProjectOutputDto } from './dtos/add-project-output.dto';
import { Request } from 'express';
import { IAddProject } from 'src/domain/contracts/use-cases/project/add-project';
import { IProject } from 'src/domain/entities/project';
import { Validator } from 'src/utilities/validator';
import { Protected } from 'src/infra/auth/keycloak.guard';
@Controller('projects')
export class AddProjectController
  implements IController<AddProjectInputDto, AddProjectOutputDto>
{
  constructor(private readonly useCase: IAddProject) {}

  @Post('/add-project')
  @UseGuards(Protected)
  async handle(
    @Body() input: AddProjectInputDto,
    @Req() req: Request,
  ): Promise<IHttpResponse<AddProjectOutputDto | Error>> {
    const authId = (req.user as any).sub;
    console.log(input, authId);

    this.validate(input, authId);

    const project = await this.useCase.execute({
      name: input.name,
      user: { authId },
    });

    const response = this.mapOutputDto(project);
    return created(response);
  }

  validate(input: AddProjectInputDto, authId: string): void {
    Validator.expect(input).toBeNotNull();
    Validator.expect(input.name).toBeNotNull().toBeString();
    Validator.expect(authId).toBeNotNull().toBeString();
  }

  mapOutputDto(input: IProject): AddProjectOutputDto {
    return new AddProjectOutputDto(input);
  }
}
