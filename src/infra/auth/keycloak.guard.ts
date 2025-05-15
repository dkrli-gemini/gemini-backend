import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import * as KeycloakConnect from 'keycloak-connect';

@Injectable()
export class KeycloakAuthGuard implements CanActivate {
  constructor(
    @Inject('KEYCLOAK_INSTANCE')
    private readonly keycloak: KeycloakConnect.Keycloak,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const result =
        await this.keycloak.grantManager.validateAccessToken(token);

      if (typeof result === 'string') {
        const decoded = this.decodeToken(result);
        request.user = this.createUserPayload(decoded);

        console.log(request.user);
        return true;
      } else if (result === false) {
        throw new Error('Invalid token');
      } else if (result && typeof result === 'object') {
        request.user = this.createUserPayload((result as any).content);
        return true;
      }

      throw new Error('Unexpected token validation result');
    } catch (error) {
      console.error('Authentication error:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(request: any): string | null {
    return request.headers.authorization?.split(' ')[1] || null;
  }

  // Type-safe token validation
  private decodeToken(token: string): any {
    try {
      const base64Payload = token.split('.')[1];
      const payload = Buffer.from(base64Payload, 'base64').toString();
      return JSON.parse(payload);
    } catch (error) {
      throw new Error('Failed to decode token');
    }
  }

  private createUserPayload(decoded: any): any {
    return {
      id: decoded.sub,
      username: decoded.preferred_username || decoded.name,
      email: decoded.email,
      roles: decoded.realm_access?.roles || [],
      clientRoles: decoded.resource_access?.['gemini-api-client']?.roles || [],
    };
  }
}
