import { Injectable, Provider } from '@nestjs/common';
import { User } from 'src/data-layer/models/user';
import { IUser } from 'src/domain/entities/user';
import { IUserRepository } from 'src/domain/repository/user.repository';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class UserRepositoryAdapter implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: IUser): Promise<User> {
    return this.prisma.userModel.create({
      data: {
        name: user.name,
        email: user.email,
        authId: user.authId,
      },
    });
  }

  async getUserByAuthId(authId: string): Promise<IUser> {
    const userModel = await this.prisma.userModel.findFirst({
      where: {
        authId: authId,
      },
    });

    return this.mapToDomain(userModel);
  }

  mapToDomain(persistencyObject: any): IUser {
    const user: IUser = {
      authId: persistencyObject.authId,
      id: persistencyObject.id,
      email: persistencyObject.email,
      name: persistencyObject.name,
    };

    return user;
  }
}

export const UserRepositoryProvider: Provider = {
  provide: IUserRepository,
  useClass: UserRepositoryAdapter,
};
