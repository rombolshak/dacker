import { Money } from '@app/models/money';
import { OperationData } from '@app/models/operation.data';
import { AccountData } from '@app/models/account.data';

export interface AccountFullData {
  currentMoney: Money;
  receivedProfit: Money;
  rate: number;

  accountData: AccountData;
  transactions: OperationData[];
  futureTransactions: OperationData[];
}
