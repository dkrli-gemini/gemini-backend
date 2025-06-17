import {
  IValuableObject,
  IValuableTagEnum,
} from 'src/domain/entities/valuable-object';
import { IValuableObjectRepository } from 'src/domain/repository/valuable-object';
import { PrismaService } from '../../prisma.service';
import { Injectable, Provider } from '@nestjs/common';

@Injectable()
export class ValuableObjectRepositoryAdapter
  implements IValuableObjectRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async createValuableObject(input: IValuableObject): Promise<IValuableObject> {
    const created = await this.prisma.valuableObjectModel.create({
      data: {
        costInCents: input.costInCents,
        alternativeCostInCents: input.alternativeCostInCents,
        chargeType: input.chargeType,
        tag: input.tag,
        entityId: input.entityId,
      },
    });

    return created as IValuableObject;
  }

  async getByTag(tag: IValuableTagEnum): Promise<IValuableObject> {
    const object = await this.prisma.valuableObjectModel.findFirst({
      where: {
        tag,
      },
    });

    return object as IValuableObject;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mapToDomain(_persistencyObject: any): IValuableObject {
    throw new Error('Method not implemented.');
  }
}

export const ValuableObjectRepositoryProvider: Provider = {
  provide: IValuableObjectRepository,
  useClass: ValuableObjectRepositoryAdapter,
};
