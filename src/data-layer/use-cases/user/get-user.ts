import { Injectable, Provider } from '@nestjs/common';
import {
  IGetUser,
  IGetUserInput,
} from 'src/domain/contracts/use-cases/user/get-user';
import { IUser } from 'src/domain/entities/user';
import { IUserRepository } from 'src/domain/repository/user.repository';

@Injectable()
export class GetUser implements IGetUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: IGetUserInput): Promise<IUser> {
    const user = await this.userRepository.getUserById(input.userId);
    return user;
  }
}

export const GetUserProvider: Provider = {
  provide: IGetUser,
  useClass: GetUser,
};
