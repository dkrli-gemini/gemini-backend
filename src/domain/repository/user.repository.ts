import { User } from 'src/data-layer/models/user';
import { IRepositoryBase } from '../contracts/repository-base';
import { IUser } from '../entities/user';
import { IEntityBase } from '../models/entity-base';

export abstract class IUserRepository implements IRepositoryBase<IUser> {
  abstract create(user: IUser): Promise<User>;
  abstract mapToDomain(persistencyObject: any): IUser;
}
