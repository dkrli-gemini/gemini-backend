import { IUser } from 'src/domain/entities/user';

export class User implements IUser {
  authId: string;
  email: string;
  name: string;
}
