import { IRepositoryBase } from '../contracts/repository-base';
import { IUser } from '../entities/user';

export abstract class IUserRepository implements IRepositoryBase<IUser> {
  abstract create(user: IUser): Promise<IUser>;
  abstract getUserById(authId: string): Promise<IUser>;
  abstract mapToDomain(persistencyObject: any): IUser;
}
