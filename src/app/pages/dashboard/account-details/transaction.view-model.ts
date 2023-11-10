import { TuiDay } from '@taiga-ui/cdk';
import { OperationType } from '@app/models/operation.data';
import { Money } from '@app/models/money';

export interface TransactionViewModel {
  id: string;
  date: TuiDay;
  amount: Money;
  type: OperationType;
  memo: string;

  justSaved: boolean;
}
