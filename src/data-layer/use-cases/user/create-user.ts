import { Injectable, Provider } from '@nestjs/common';
import {
  ICreateUser,
  ICreateUserInput,
} from 'src/domain/contracts/use-cases/user/create-user';
import { IUser } from 'src/domain/entities/user';
import { IUserRepository } from 'src/domain/repository/user.repository';

@Injectable()
export class CreateUser implements ICreateUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: ICreateUserInput): Promise<IUser> {
    const user = await this.userRepository.createUser({
      name: input.name,
      email: input.email,
      id: input.id,
    });

    return user;
  }
}

export const CreateUserProvider: Provider = {
  provide: ICreateUser,
  useClass: CreateUser,
};
