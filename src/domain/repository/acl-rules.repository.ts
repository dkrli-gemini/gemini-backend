import { IRepositoryBase } from '../contracts/repository-base';
import { IAclRule } from '../entities/acl-list';

export abstract class IAclRulesRepository implements IRepositoryBase<IAclRule> {
  abstract createAclRule(input: IAclRule): Promise<IAclRule>;
  abstract listAclByList(aclListId: string): Promise<IAclRule[]>;
  abstract mapToDomain(persistencyObject: any): IAclRule;
}
