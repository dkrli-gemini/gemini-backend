import { IUser } from 'src/domain/entities/user';

export class GetUserOutputDto {
  id: string;
  name: string;
  email: string;

  constructor(user: IUser) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
  }
}
