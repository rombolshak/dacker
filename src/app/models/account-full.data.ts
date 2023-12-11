import { Money } from '@app/models/money';
import { OperationData } from '@app/models/operation.data';
import { AccountData } from '@app/models/account.data';
import { TuiDay } from '@taiga-ui/cdk';

export interface AccountFullData {
  currentMoney: Money;
  receivedProfit: Money;
  rate: number;
  xirr: number;

  accountData: AccountData;
  transactions: OperationData[];
  futureTransactions: OperationData[];

  closingDate: TuiDay | null;
  remainingDuration: number | null;
}
