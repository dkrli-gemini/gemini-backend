import { IUseCase } from '../../use-case';

export interface ICreateAclListInput {
  name: string;
  description: string;
  projectId: string;
}

export type ICreateAclListOutput = boolean;

export abstract class ICreateAclList
  implements IUseCase<ICreateAclListInput, ICreateAclListOutput>
{
  abstract execute(input: ICreateAclListInput): Promise<boolean>;
}
