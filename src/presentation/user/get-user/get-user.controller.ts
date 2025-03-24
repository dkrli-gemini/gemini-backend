// import { Controller, Get, Req } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';
// import { Request } from 'express';
// import { ParamsDictionary } from 'express-serve-static-core';
// import { ParsedQs } from 'qs';
// import { IController } from 'src/domain/contracts/controller';
// import { IHttpResponse, ok } from 'src/domain/contracts/http';
// import { IGetUser } from 'src/domain/contracts/use-cases/user/get-user';
// import { IUser } from 'src/domain/entities/user';
// import { GetUserOutputDto } from './dtos/get-user-output.dto';

// @Controller('users')
// @ApiTags('users')
// export class GetUserController implements IController<null, GetUserOutputDto> {
//   constructor(private readonly useCase: IGetUser) {}

//   @Get('me')
//   async handle(
//     input: null,
//     @Req()
//     req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
//     projectId?: string,
//   ): Promise<IHttpResponse<GetUserOutputDto | Error>> {
//     const userId = (req.user as any).sub;
//     const user = await this.useCase.execute({ userId });
//     const response = this.mapToOutput(user);
//     return ok(response);
//   }

//   private mapToOutput(user: IUser): GetUserOutputDto {
//     return new GetUserOutputDto(user);
//   }
// }
