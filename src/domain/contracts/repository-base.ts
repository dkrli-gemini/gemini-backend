import { IEntityBase } from '../models/entity-base';

export abstract class IRepositoryBase<T> {
  abstract mapToDomain(persistencyObject: any): T;
}
