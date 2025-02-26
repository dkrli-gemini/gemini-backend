import { Injectable } from '@nestjs/common';
import {
  ILogin,
  ILoginInput,
  ILoginOutput,
} from 'src/domain/contracts/use-cases/auth/login';

@Injectable()
export class Login implements ILogin {
  async execute(input: ILoginInput): Promise<ILoginOutput> {
    
  }
}
