import { IRepositoryBase } from '../contracts/repository-base';
import { ITransaction } from '../entities/transaction';

export abstract class ITransactionRepository
  implements IRepositoryBase<ITransaction>
{
  abstract createTransaction(input: ITransaction): Promise<ITransaction>;
  abstract listTransactions(domainId: string): Promise<ITransaction[]>;
  abstract mapToDomain(persistencyObject: any): ITransaction;
}
