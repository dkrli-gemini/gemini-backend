import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { KeycloakConfigService } from './keycloak.config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class Protected implements CanActivate {
  constructor(private readonly keycloakConfigService: KeycloakConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization Header');
    }

    const token = authHeader.split(' ')[1]; // Extract token
    if (!token) {
      throw new UnauthorizedException('Invalid Bearer Token');
    }

    try {
      const decoded = jwt.decode(token); // Decode the JWT
      if (!decoded) {
        throw new UnauthorizedException('Invalid Token');
      }

      request.user = decoded; // Attach user to request
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token Validation Failed');
    }
  }
}
