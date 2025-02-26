import { Injectable } from '@nestjs/common';
import {
  ILogin,
  ILoginInput,
  ILoginOutput,
} from 'src/domain/contracts/use-cases/auth/login';

@Injectable()
export class Login implements ILogin {
  private readonly keycloakUrl = process.env.KEYCLOAK_URL;
  private readonly realm = process.env.KEYCLOAK_REALM;
  private readonly clientId = process.env.KEYCLOAK_CLIENT_ID;

  async execute(input: ILoginInput): Promise<ILoginOutput> {
    try {
      const response = await axios
    }
  }
}
