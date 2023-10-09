import { Identifiable } from '@app/models/identifiable';
import { Timestamp } from '@angular/fire/firestore';

type OperationType = 'contribution' | 'withdrawal' | 'interest' | 'comission';
export interface OperationData extends Identifiable {
  date: Timestamp;
  type: OperationType;
  amount: number;
  memo: string;
}
