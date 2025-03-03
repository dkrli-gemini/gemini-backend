import { Injectable } from '@nestjs/common';
import { User } from 'src/data-layer/models/user';
import { IUser } from 'src/domain/entities/user';
import { IUserRepository } from 'src/domain/repository/user.repository';

@Injectable()
export class UserRepositoryAdapter implements IUserRepository {
  async create(user: IUser): Promise<User> {
    throw new Error('Method not implemented');
  }
  mapToDomain(persistencyObject: any): IUser {
    throw new Error('Method not implemented.');
  }
}
