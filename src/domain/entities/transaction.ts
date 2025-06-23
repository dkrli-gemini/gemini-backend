import { IEntityBase } from '../models/entity-base';
import { IValuableObject } from './valuable-object';

export interface ITransaction extends IEntityBase {
  name: string;
  description: string;
  object: IValuableObject;
  domainId: string;
}
