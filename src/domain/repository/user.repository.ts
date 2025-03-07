import { User } from 'src/data-layer/models/user';
import { IRepositoryBase } from '../contracts/repository-base';
import { IUser } from '../entities/user';

export abstract class IUserRepository implements IRepositoryBase<IUser> {
  abstract create(user: IUser, authId: string): Promise<User>;
  abstract getUserById(authId: string): Promise<IUser>;
  abstract mapToDomain(persistencyObject: any): IUser;
}
