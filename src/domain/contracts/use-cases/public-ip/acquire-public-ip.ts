import { IPublicIp } from 'src/domain/entities/public-ips';
import { IUseCase } from '../../use-case';

export class IAcquirePublicIpInput {
  projectId: string;
}

export type IAcquirePublicIpOutput = IPublicIp;

export abstract class IAcquirePublicIp
  implements IUseCase<IAcquirePublicIpInput, IAcquirePublicIpOutput>
{
  abstract execute(input: IAcquirePublicIpInput): Promise<IPublicIp>;
}
