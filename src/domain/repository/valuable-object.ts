import { IRepositoryBase } from '../contracts/repository-base';
import { IValuableObject, IValuableTagEnum } from '../entities/valuable-object';

export abstract class IValuableObjectRepository
  implements IRepositoryBase<IValuableObject>
{
  abstract createValuableObject(
    input: IValuableObject,
  ): Promise<IValuableObject>;
  abstract getByTag(tag: IValuableTagEnum): Promise<IValuableObject>;
  abstract mapToDomain(persistencyObject: any): IValuableObject;
}
