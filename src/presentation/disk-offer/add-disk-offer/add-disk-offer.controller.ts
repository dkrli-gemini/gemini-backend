/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { AddDiskOfferInputDto } from './dtos/add-disk-offer.input.dto';
import { AddDiskOfferOutputDto } from './dtos/add-disk-offer.output.dto';
import { Request } from 'express';
import { created, IHttpResponse } from 'src/domain/contracts/http';
import { IVolumeOfferRepository } from 'src/domain/repository/volume-offer.repository';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';

@Controller('disk-offer')
export class AddDiskOfferController
  implements IController<AddDiskOfferInputDto, AddDiskOfferOutputDto>
{
  constructor(private readonly diskOfferRepository: IVolumeOfferRepository) {}

  @Post('add-offer')
  @AuthorizedTo(RolesEnum.ADMIN)
  async handle(
    @Body() input: AddDiskOfferInputDto,
    req: Request,
    projectId?: string,
  ): Promise<IHttpResponse<AddDiskOfferOutputDto | Error>> {
    const offerCreated = await this.diskOfferRepository.createVolumeOffer({
      name: input.name,
      cloudstackId: input.cloudstackId,
      capacity: input.capacity,
    });

    const response = new AddDiskOfferOutputDto(offerCreated.id);
    return created(response);
  }
}
