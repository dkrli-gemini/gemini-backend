import { IUser } from 'src/domain/entities/user';

export class User implements IUser {
  email: string;
  name: string;
}
