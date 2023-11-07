import { TuiDay } from '@taiga-ui/cdk';
import { OperationType } from '@app/models/operation.data';

export interface TransactionViewModel {
  id: string;
  date: TuiDay;
  amount: number;
  type: OperationType;
  memo: string;

  justSaved: boolean;
}
