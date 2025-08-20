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
      console.log(`Successfully created user "${createUserDto.username}".`);
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

  async decodeToken(token: string): Promise<any> {
    try {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      return decodedToken;
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Could not decode token');
    }
  }
}
