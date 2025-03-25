import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';

export interface CloudstackParams {
  [key: string]: string;
}

export namespace CloudstackCommands {
  export enum VirtualMachine {
    ListVirtualMachines = 'listVirtualMachines',
  }
  export enum Network {
    ListNetworks = 'listNetworks',
  }
  export enum User {
    ListUsers = 'listUsers',
    CreateUser = 'createUser',
    DeleteUser = 'deleteUser',
  }
  export enum Account {
    ListAccounts = 'listAccounts',
  }
}

export interface CloudstackServiceInput {
  command: string;
  additionalParams?: CloudstackParams;
}

@Injectable()
export class CloudstackService {
  private cloudstackUrl: string;
  private cloudstackApiKey: string;
  private cloudstackSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.cloudstackUrl = configService.get<string>('CLOUDSTACK_URL');
    this.cloudstackApiKey = configService.get<string>('CLOUDSTACK_API_KEY');
    this.cloudstackSecret = configService.get<string>('CLOUDSTACK_SECRET');
  }

  private generateSignature(params: CloudstackParams): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');

    const stringToSign = sortedParams.toLowerCase();
    const hmac = crypto.createHmac('sha1', this.cloudstackSecret);
    hmac.update(stringToSign);

    const base64Signature = hmac.digest().toString('base64');
    return base64Signature;
  }

  public async handle(input: CloudstackServiceInput): Promise<any> {
    const params: CloudstackParams = {
      command: input.command || '',
      apiKey: this.cloudstackApiKey,
      response: 'json',
      ...input.additionalParams,
    };

    const signature = this.generateSignature(params);
    params['signature'] = signature;

    try {
      const response = await axios.get(this.cloudstackUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Error in Cloudstack API Request', error);
      return {
        error,
      };
    }
  }
}
