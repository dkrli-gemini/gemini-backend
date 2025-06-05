import { IEntityBase } from '../models/entity-base';

export interface IVPC extends IEntityBase {
  name: string;
  cidr: string;
  dns1: string;
  dns2: string;
  state: string;
}
