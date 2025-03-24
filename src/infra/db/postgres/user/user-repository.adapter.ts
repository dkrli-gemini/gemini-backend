import { Injectable, Provider } from '@nestjs/common';
import { IUser } from 'src/domain/entities/user';
import { IUserRepository } from 'src/domain/repository/user.repository';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class UserRepositoryAdapter implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: IUser, authId: string): Promise<IUser> {
    // return this.prisma.userModel.create({
    //   data: {
    //     id: authId,
    //     name: user.name,
    //     email: user.email,
    //   },
    // });
    return null;
  }

  async getUserById(userId: string): Promise<IUser> {
    const userModel = await this.prisma.userModel.findUnique({
      where: {
        id: userId,
      },
    });

    return this.mapToDomain(userModel);
  }

  mapToDomain(persistencyObject: any): IUser {
    const user: IUser = {
      id: persistencyObject.id,
      email: persistencyObject.email,
      name: persistencyObject.name,
    } as IUser;

    return user;
  }
}

export const UserRepositoryProvider: Provider = {
  provide: IUserRepository,
  useClass: UserRepositoryAdapter,
};
