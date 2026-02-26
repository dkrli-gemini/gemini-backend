import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as querystring from 'querystring';
import { jwtDecode } from 'jwt-decode';

import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CredentialDto {
  @IsString()
  @IsNotEmpty()
  type: string = 'password';

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsBoolean()
  @IsOptional()
  temporary?: boolean = false;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsBoolean()
  enabled: boolean = true;

  @ValidateNested({ each: true })
  @Type(() => CredentialDto)
  credentials: CredentialDto[];
}

export type KeycloakUserRef = {
  id: string;
  username?: string;
  email?: string;
};

@Injectable()
export class KeycloakService {
  private readonly keycloakUrl: string;
  private readonly realm: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private configService: ConfigService) {
    this.keycloakUrl = this.configService.get<string>('KEYCLOAK_URL');
    this.realm = this.configService.get<string>('KEYCLOAK_REALM');
    this.clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID');
    this.clientSecret = this.configService.get<string>(
      'KEYCLOAK_CLIENT_SECRET',
    );
  }

  private async getAccessToken(): Promise<string> {
    const tokenEndpoint = `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`;
    try {
      const response = await axios({
        method: 'post',
        url: tokenEndpoint,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: querystring.stringify({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      });
      const accessToken = response.data.access_token;
      return accessToken;
    } catch (error) {
      console.error('Keycloak Service Error', error);
      throw new Error('could not fetch access token from keycloak');
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const accessToken = await this.getAccessToken();
    const usersEndpoint = `${this.keycloakUrl}/admin/realms/${this.realm}/users`;

    try {
      const response = await axios({
        method: 'post',
        url: usersEndpoint,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        data: createUserDto,
      });
      // Return minimal success confirmation or user location from headers
      return {
        statusCode: response.status,
        message: `User ${createUserDto.username} created successfully.`,
        location: response.headers.location,
      };
    } catch (error) {
      console.error(
        'KeycloakService Error (createUser):',
        error.response?.data || error.message,
      );
      throw new Error(
        `Could not create user in Keycloak: ${error.response?.data?.errorMessage || error.message}`,
      );
    }
  }

  async createOrGetUser(createUserDto: CreateUserDto): Promise<{
    id: string;
    created: boolean;
  }> {
    const accessToken = await this.getAccessToken();
    const usersEndpoint = `${this.keycloakUrl}/admin/realms/${this.realm}/users`;

    const response = await axios({
      method: 'post',
      url: usersEndpoint,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: createUserDto,
      validateStatus: () => true,
    });

    if (response.status === 201) {
      const idFromLocation = this.extractUserIdFromLocation(
        response.headers?.location as string | undefined,
      );

      if (idFromLocation) {
        return { id: idFromLocation, created: true };
      }

      const existingUser = await this.findUserByUsername(createUserDto.username);
      if (existingUser?.id) {
        return { id: existingUser.id, created: true };
      }

      throw new Error('Usuário criado no Keycloak sem retorno de identificador.');
    }

    if (response.status === 409) {
      const existingUser = await this.findUserByUsername(createUserDto.username);
      if (!existingUser?.id) {
        throw new Error(
          `Usuário ${createUserDto.username} já existe no Keycloak, mas não foi encontrado para sincronização.`,
        );
      }

      return { id: existingUser.id, created: false };
    }

    throw new Error(
      `Could not create user in Keycloak: status ${response.status} - ${JSON.stringify(response.data)}`,
    );
  }

  async ensureRealmRoles(userId: string, roleNames: string[]): Promise<void> {
    if (!userId || !Array.isArray(roleNames) || roleNames.length === 0) {
      return;
    }

    const accessToken = await this.getAccessToken();
    const normalizedRequested = Array.from(
      new Set(
        roleNames
          .filter((role) => typeof role === 'string' && role.trim().length > 0)
          .map((role) => role.trim().toLowerCase()),
      ),
    );

    if (normalizedRequested.length === 0) {
      return;
    }

    const rolesResponse = await axios({
      method: 'get',
      url: `${this.keycloakUrl}/admin/realms/${this.realm}/roles`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        first: 0,
        max: 500,
      },
      validateStatus: () => true,
    });

    if (rolesResponse.status !== 200) {
      throw new Error(
        `Could not list Keycloak realm roles: status ${rolesResponse.status}`,
      );
    }

    const roleMap = new Map<string, any>();
    for (const role of Array.isArray(rolesResponse.data) ? rolesResponse.data : []) {
      const name =
        typeof role?.name === 'string' ? role.name.toLowerCase().trim() : '';
      if (name) {
        roleMap.set(name, role);
      }
    }

    const foundRoles = normalizedRequested
      .map((roleName) => roleMap.get(roleName))
      .filter(Boolean);
    if (foundRoles.length === 0) {
      return;
    }

    const existingResponse = await axios({
      method: 'get',
      url: `${this.keycloakUrl}/admin/realms/${this.realm}/users/${userId}/role-mappings/realm`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      validateStatus: () => true,
    });

    const existingNames = new Set(
      (Array.isArray(existingResponse.data) ? existingResponse.data : [])
        .map((role: any) => String(role?.name ?? '').toLowerCase())
        .filter((name: string) => name.length > 0),
    );

    const missingRoles = foundRoles.filter(
      (role: any) => !existingNames.has(String(role?.name ?? '').toLowerCase()),
    );

    if (missingRoles.length === 0) {
      return;
    }

    const assignResponse = await axios({
      method: 'post',
      url: `${this.keycloakUrl}/admin/realms/${this.realm}/users/${userId}/role-mappings/realm`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: missingRoles,
      validateStatus: () => true,
    });

    if (assignResponse.status < 200 || assignResponse.status >= 300) {
      throw new Error(
        `Could not assign Keycloak realm roles: status ${assignResponse.status}`,
      );
    }
  }

  async findUserByUsername(username: string): Promise<KeycloakUserRef | null> {
    const accessToken = await this.getAccessToken();
    const usersEndpoint = `${this.keycloakUrl}/admin/realms/${this.realm}/users`;

    const response = await axios({
      method: 'get',
      url: usersEndpoint,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        username,
        exact: true,
      },
      validateStatus: () => true,
    });

    if (response.status !== 200) {
      throw new Error(
        `Could not query users in Keycloak: status ${response.status}`,
      );
    }

    const found = (Array.isArray(response.data) ? response.data : []).find(
      (user: any) =>
        typeof user?.username === 'string' &&
        user.username.toLowerCase() === username.toLowerCase(),
    );

    if (!found?.id) {
      return null;
    }

    return {
      id: found.id,
      username: found.username,
      email: found.email,
    };
  }

  private extractUserIdFromLocation(location?: string): string | null {
    if (!location) {
      return null;
    }

    const parts = location.split('/').filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : null;
  }

  async decodeToken(token: string): Promise<any> {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken;
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Could not decode token');
    }
  }
}
